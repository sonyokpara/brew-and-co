#!/usr/bin/env node
/**
 * Optimize raster images under public/: resize to a maximum edge and convert
 * JPEG/PNG to WebP, delete the originals, and rewrite every reference to them
 * in the codebase so nothing breaks.
 *
 *   node .claude/skills/optimize-images/scripts/optimize.mjs [options] [paths...]
 *
 * Options:
 *   --max <px>       Longest edge after resizing (default 1920). Never upscales.
 *   --quality <n>    WebP quality 1-100 (default 80).
 *   --dry-run        Report what would change without writing anything.
 *   --json           Print the result as JSON instead of text.
 *
 * Paths default to public/. Files or directories may be given; only .jpg,
 * .jpeg and .png files are converted. Already-optimized .webp files are left
 * alone, so the script is safe to re-run.
 */
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RASTER = /\.(jpe?g|png)$/i;
const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|mdx?|css|html|json|csv|ya?ml|txt)$/i;
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".vercel", "dist", "build", "out"]);
// Where references to public/ assets live. package-lock and similar are skipped below.
const REFERENCE_ROOTS = ["app", "lib", "components", "src", "docs", "public", "content", "data"];
// Data files often store a bare file name ("espresso.jpg") that code joins onto a folder.
const DATA_ROOTS = ["data", "content"];

export async function optimizeImages({
  root = process.cwd(),
  targets = ["public"],
  max = 1920,
  quality = 80,
  dryRun = false,
} = {}) {
  const publicDir = path.join(root, "public");
  const files = [];
  for (const t of targets) await collect(path.resolve(root, t), files, (f) => RASTER.test(f));

  const converted = [];
  for (const file of files) {
    if (!isInside(file, publicDir)) continue; // only public assets are served by URL
    const out = file.replace(RASTER, ".webp");
    const before = (await stat(file)).size;
    const img = sharp(file, { failOn: "none" }).rotate(); // honor EXIF orientation
    const meta = await img.metadata();
    const pipeline = img
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 5, alphaQuality: 90 });
    let after = before;
    let width = meta.width;
    let height = meta.height;
    if (!dryRun) {
      const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
      await writeFile(out, data);
      await rm(file);
      after = data.length;
      ({ width, height } = info);
    }
    converted.push({
      from: toPosix(path.relative(root, file)),
      to: toPosix(path.relative(root, out)),
      before,
      after,
      size: `${width}x${height}`,
      originalSize: `${meta.width}x${meta.height}`,
    });
  }

  const rewrites = converted.length ? await rewriteReferences(root, publicDir, converted, dryRun) : [];
  return { converted, rewrites, dryRun };
}

/** Replace old public paths with the new .webp ones in source, docs and credits files. */
async function rewriteReferences(root, publicDir, converted, dryRun) {
  const textFiles = [];
  for (const dir of REFERENCE_ROOTS) {
    await collect(path.join(root, dir), textFiles, (f) => TEXT_EXT.test(f) && !/package-lock\.json$/.test(f));
  }
  // Bare names are only safe to rewrite when no other public image shares them.
  const allPublic = [];
  await collect(publicDir, allPublic, (f) => RASTER.test(f) || /\.webp$/i.test(f));
  const nameCount = new Map();
  for (const f of allPublic) nameCount.set(path.basename(f), (nameCount.get(path.basename(f)) ?? 0) + 1);
  const dataDirs = DATA_ROOTS.map((d) => path.join(root, d));

  const rewrites = [];
  for (const file of textFiles) {
    const src = await readFile(file, "utf8");
    let next = src;
    for (const c of converted) {
      const oldAbs = path.join(root, c.from);
      const newAbs = path.join(root, c.to);
      // "images/menu/x.jpg" as used in URLs ("/images/menu/x.jpg"), plus the path
      // relative to the referencing file for Markdown such as public/images/CREDITS.md.
      const pairs = [[rel(publicDir, oldAbs), rel(publicDir, newAbs)]];
      if (isInside(file, publicDir)) {
        pairs.push([rel(path.dirname(file), oldAbs), rel(path.dirname(file), newAbs)]);
      }
      const oldName = path.basename(oldAbs);
      if (dataDirs.some((d) => isInside(file, d)) && (nameCount.get(oldName) ?? 0) <= 1) {
        pairs.push([oldName, path.basename(newAbs)]);
      }
      for (const [a, b] of pairs) next = replaceWholePath(next, a, b);
    }
    if (next !== src) {
      if (!dryRun) await writeFile(file, next);
      rewrites.push(toPosix(path.relative(root, file)));
    }
  }
  return rewrites;
}

/** Replace `a` with `b` only where `a` isn't part of a longer path or file name. */
function replaceWholePath(text, a, b) {
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(^|[^A-Za-z0-9_./-])(\\/?)${esc}(?![A-Za-z0-9_-])`, "g"), `$1$2${b}`);
}

async function collect(p, out, keep) {
  let s;
  try {
    s = await stat(p);
  } catch {
    return;
  }
  if (s.isFile()) {
    if (keep(p)) out.push(p);
    return;
  }
  for (const entry of await readdir(p, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    await collect(path.join(p, entry.name), out, keep);
  }
}

const toPosix = (p) => p.split(path.sep).join("/");
const rel = (from, to) => toPosix(path.relative(from, to));
const isInside = (file, dir) => !path.relative(dir, file).startsWith("..");
const kb = (n) => `${Math.round(n / 1024)} KB`;

export function formatReport({ converted, rewrites, dryRun }) {
  if (!converted.length) return "No JPEG or PNG images to optimize in public/.";
  const saved = converted.reduce((s, c) => s + c.before - c.after, 0);
  const lines = [
    `${dryRun ? "Would optimize" : "Optimized"} ${converted.length} image(s) to WebP${dryRun ? "" : `, saving ${kb(saved)}`}:`,
    ...converted.map(
      (c) =>
        `  ${c.from} -> ${c.to}  (${c.originalSize} -> ${c.size}${dryRun ? "" : `, ${kb(c.before)} -> ${kb(c.after)}`})`,
    ),
  ];
  if (rewrites.length) lines.push(`${dryRun ? "Would update" : "Updated"} references in: ${rewrites.join(", ")}`);
  else lines.push("No references to these files were found in app/, lib/, docs/, data/ or public/.");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opts = { targets: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--max") opts.max = Number(args[++i]);
    else if (a === "--quality") opts.quality = Number(args[++i]);
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--json") opts.json = true;
    else opts.targets.push(a);
  }
  if (!opts.targets.length) delete opts.targets;
  const result = await optimizeImages(opts);
  console.log(opts.json ? JSON.stringify(result, null, 2) : formatReport(result));
}

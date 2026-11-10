#!/usr/bin/env node
/**
 * PostToolUse hook for Bash/PowerShell. When a command downloads from a stock
 * photo site, or puts a JPEG/PNG into public/, run the optimizer and tell
 * Claude which files were renamed to .webp. Silent otherwise.
 */
import path from "node:path";
import { formatReport, optimizeImages } from "./optimize.mjs";

const STOCK =
  /(pexels\.com|unsplash\.com|pixabay\.com|stocksnap\.io|burst\.shopify\.com|freepik\.com|istockphoto\.com|shutterstock\.com|gettyimages\.|rawpixel\.com|kaboompics\.com|pikwizard\.com|picjumbo\.com|stockvault\.net|freeimages\.com)/i;
const TOUCHES_PUBLIC_IMAGE = /public[\\/][^\s"'`]*\.(jpe?g|png)\b|public[\\/]/i;
const WRITES_FILES = /\b(cp|mv|curl|wget|Copy-Item|Move-Item|Invoke-WebRequest|iwr|node|python|magick|convert)\b/i;

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}
const command = String(input?.tool_input?.command ?? "");
const relevant = STOCK.test(command) || (TOUCHES_PUBLIC_IMAGE.test(command) && WRITES_FILES.test(command));
if (!relevant) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
try {
  const result = await optimizeImages({ root: path.resolve(root) });
  if (!result.converted.length) process.exit(0);
  const report = formatReport(result);
  console.log(
    JSON.stringify({
      systemMessage: `optimize-images: converted ${result.converted.length} image(s) to WebP`,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext:
          `${report}\nThe originals were deleted. Use the .webp paths from now on, and check the build if any reference sits outside the folders listed.`,
      },
    }),
  );
} catch (err) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `optimize-images hook failed: ${err?.message ?? err}. Run the optimize-images skill manually.`,
      },
    }),
  );
}

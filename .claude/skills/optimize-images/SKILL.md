---
name: optimize-images
description: Resize and convert the site's images in public/ to WebP so pages load faster, and update every reference to them. Use whenever an image is downloaded from Pexels, Unsplash, Pixabay or any other stock photo site, whenever a JPEG or PNG is added to public/, or when asked to optimize, compress, resize or convert images. A project hook also runs it automatically after such downloads.
---

# Optimize images

Converts every `.jpg`, `.jpeg` and `.png` under `public/` to `.webp`, resized so the longest edge is at most 1920px (never upscaled), at quality 80. It deletes each original and rewrites references to it in `app/`, `lib/`, `docs/`, `data/` and `public/` (including `public/images/CREDITS.md`, and bare file names such as `espresso.jpg` in `data/menu-items.csv` when no other image shares the name), so the site keeps working. Already-converted `.webp` files are skipped, so it is safe to re-run.

## Run it

```bash
node .claude/skills/optimize-images/scripts/optimize.mjs            # all of public/
node .claude/skills/optimize-images/scripts/optimize.mjs --dry-run  # preview only
node .claude/skills/optimize-images/scripts/optimize.mjs public/images/menu --max 1200 --quality 75
```

It prints each conversion (dimensions and size before and after) and the files whose references it updated.

## Automatic trigger

`.claude/settings.json` runs `scripts/hook.mjs` after every Bash or PowerShell command. The hook acts only when the command mentions a stock photo site (pexels.com, unsplash.com, pixabay.com and others) or writes into `public/`. It then runs the optimizer and reports the renamed files back, so the new `.webp` paths are used from then on. When nothing needs converting it stays silent.

Stock downloads usually go to a scratch folder first; the hook converts them once they're copied into `public/`.

## After it runs

1. Check the report's list of updated files. If a reference lives somewhere else (a new top-level folder, a CMS, an external URL), update it by hand.
2. Run `npx tsc --noEmit -p .` and `npx next build` or load the affected pages to confirm no image 404s.
3. Commit the deleted originals, the new `.webp` files and the rewritten references together.

## Notes

- Only `public/` is touched. `app/icon.png` and `app/apple-icon.png` stay PNG: Next's icon conventions don't accept WebP.
- `next/image` already serves resized WebP or AVIF to browsers. Converting the sources still shrinks the repo and deploys, speeds up the image optimizer, and helps assets that bypass `next/image`, such as the hero video's `poster`.
- Keep a downloaded original outside `public/` if you may need a larger version later; the conversion is lossy and caps the size at 1920px.
- Uses `sharp`, which is in `devDependencies`.

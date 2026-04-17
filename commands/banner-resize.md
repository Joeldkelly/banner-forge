---
description: Re-run the resize step only against an existing master build, producing new sizes without rebuilding copy or assets.
argument-hint: <build-dir> [--sizes 300x250,728x90,...]
---

# /banner-resize

Add or regenerate sizes from an existing `./build/` output. Skips ingest and copy synthesis.

## Usage

```
/banner-resize ./build --sizes 300x600,970x250
```

Or, to resize to the full canonical matrix:

```
/banner-resize ./build --sizes all
```

## What happens

1. Reads `banner.config.json` to pick up brand tokens and copy.
2. Overrides `config.sizes` with the `--sizes` argument.
3. Runs `scripts/build.js` only for the requested sizes. Existing size directories outside the override list are left untouched.
4. Runs `scripts/render.js` and `scripts/package.js` for the new sizes only.
5. Appends to the existing `dist/validation-report.json` rather than overwriting it.

## Notes

- Sizes must exist in `references/SIZES.md`. Unknown sizes are rejected.
- Sizes with a CSS-only template flag (≤50KB) are routed to the CSS template regardless of the config's `animation.template` setting.
- This command does **not** re-ingest from Figma. If the master changed, use `/banner-from-figma` instead.

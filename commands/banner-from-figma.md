---
description: Generate a full display campaign from a Figma frame URL. Extracts tokens, copy, and assets via the Figma MCP, then runs the full build → render → package → validate pipeline.
argument-hint: <figma-frame-url>
---

# /banner-from-figma

Turn a Figma frame into 15+ network-ready banner zips.

## Usage

```
/banner-from-figma https://www.figma.com/file/ABC123/Campaign?node-id=1-42
```

## What happens

1. **Ingest** — the skill calls `node scripts/figma-import.js <url>` which uses the Figma MCP to pull:
   - Frame dimensions (treated as the master)
   - Text styles and content (headline, subhead, CTA, legal)
   - Color variables (primary, accent, background, text)
   - Text layers mapped to roles by layer naming convention (`headline/`, `subhead/`, `cta/`, `logo/`, `hero/`)
   - Image fills exported as PNG into `./assets/`
   The result is written to `banner.config.json`.

2. **Free-seat fallback** — if the Figma MCP reports no write-back permission, the skill logs a single warning and proceeds read-only. No variants are pushed back to Figma.

3. **Pipeline** — runs `scripts/build.js`, `scripts/render.js`, `scripts/package.js`, `scripts/validate.js` against the generated config.

4. **Report** — summarize sizes built, total bytes per zip, validation pass/fail, and the path to `dist/`.

## Config overrides

If `banner.config.json` already exists, `figma-import.js` merges Figma-derived values on top, leaving user overrides (sizes, networks, animation template, limits) untouched.

## Layer naming convention

Author the Figma frame with layers named in lowercase with a role prefix:

- `headline/Spring savings`
- `subhead/Up to 30% off`
- `cta/Shop now`
- `logo/` (containing the logo symbol or SVG)
- `hero/` (containing the hero image or image fill)

Unnamed layers are ignored.

## Prerequisites

- Figma MCP connected in Claude Code settings
- A paid Figma seat for write-back (read-only works on any seat)

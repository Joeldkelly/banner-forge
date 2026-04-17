---
name: banner-forge
description: Generate complete banner ad campaigns across 15+ IAB, programmatic, and social sizes from a single brand config or Figma frame. Use when the user needs display ads, HTML5 banners, animated GIFs, static images for Meta/LinkedIn/TikTok, or wants to batch-resize creative across ad-network specs (Google Ads, DV360, The Trade Desk, Adform, Amazon DSP).
license: Apache-2.0
metadata:
  author: Joel Kelly (joel.design)
  version: 0.1.0
  tags: [design, advertising, html5, figma, display-ads, iab, gsap, animation]
allowed-tools: [Bash, Read, Write, Edit, WebFetch]
---

# banner-forge

Turn one brand config into a complete, network-ready display campaign. Config-first, Figma-optional. Every deliverable under 150KB, clickTag-wired, validator-passing.

## When to invoke

Use this skill when the user asks to:

- Generate banner ads, display ads, IAB sizes, or HTML5 banners
- Resize a creative across ad-network specs
- Produce Google Ads / DV360 / TTD / Adform / Amazon DSP zips
- Turn a Figma frame into production banners
- Animate a banner with GSAP
- Validate an existing HTML5 banner against network rules

Do **not** invoke for: Meta/LinkedIn/TikTok newsfeed static or video creative (Meta refuses HTML5 — route the user to V1 static/video path when available, or produce static PNG/MP4 directly).

## Core principle

**One pipeline, file-based, resumable.** Each stage reads JSON sidecars from the previous stage and writes its own. Failures are scoped to one stage. Never rebuild what you don't have to.

```
banner.config.json
    → scripts/build.js    → build/<size>/{index.html, assets/, meta.json}
    → scripts/render.js   → build/<size>/{backup.png, preview.gif, preview.mp4}
    → scripts/package.js  → dist/<network>/<size>.zip
    → scripts/validate.js → dist/validation-report.json
```

## Happy path (config → deliverables)

1. Verify a `banner.config.json` exists at the project root. If not, copy `banner.config.example.json` and ask the user to fill it in.
2. Run `node scripts/build.js` — templates in `templates/gsap/` are filled from config and written per-size to `build/<size>/`.
3. Run `node scripts/render.js` — Puppeteer captures the last animation frame as `backup.png` (sharp-compressed), then a full MP4 via native page.screencast, and a GIF via gifski.
4. Run `node scripts/package.js` — builds per-network zips in `dist/<network>/<size>.zip` with the correct manifest (Adform `manifest.json`, Google `index.html` at root with clickTag var).
5. Run `node scripts/validate.js` — checks file size (≤150KB), clickTag presence, required assets, manifest correctness. Writes `dist/validation-report.json`.
6. Summarize for the user: sizes built, total bytes, any validation failures, and where the zips landed.

All five stages are wrapped by `scripts/build-all.sh` or `npm run all`.

## Entry points

### From a config file (default, no Figma)

User provides or edits `banner.config.json`. The skill runs the four-stage pipeline. See `banner.config.example.json` for schema.

### From a Figma frame

`/banner-from-figma <url>` triggers `scripts/figma-import.js`, which uses the Figma MCP to extract tokens, text styles, and assets into a `banner.config.json`, then falls through to the default pipeline.

**Graceful fallback for free-seat Figma users:** write-back requires a paid Figma seat. The skill detects this and degrades to read-only mode, writing the generated config to disk instead of pushing variants back into the Figma file. Log a single warning and continue.

### From a brief (no Figma, no config)

`/banner-from-brief <path>` reads a brief (markdown, text, PDF via future pdf-extract), asks Claude to synthesize brand tokens + copy + sizes + networks into `banner.config.json`, then falls through to the default pipeline.

## Canonical size matrix

See [references/SIZES.md](./references/SIZES.md) for the full table. The 15 MVP sizes:

300x250, 336x280, 300x600, 728x90, 970x90, 970x250, 160x600, 120x600, 320x50, 320x100, 300x50, 300x1050, 468x60, 250x250, 200x200.

**Rules:**
- Sizes ≤ 50KB target (300x50, 320x50, 300x600 mobile-first variants) **must** use the CSS-only template, not GSAP. See [references/ANIMATION.md](./references/ANIMATION.md).
- Sizes with a fixed polite-load ceiling (Google 150KB initial / 2.2MB total) are pre-validated in `scripts/validate.js`.

## clickTag pattern

Use the dual global pattern so one zip passes Google, DV360, TTD, and Adform:

```html
<script>
  var clickTag = "https://example.com/landing";
  var clickTAG = clickTag; // TTD + Adform legacy uppercase
</script>
```

Adform additionally requires a `manifest.json` at zip root. `scripts/package.js` handles this per-network.

Full rules: [references/CLICKTAG.md](./references/CLICKTAG.md).

## Animation

- **Default:** GSAP 3.13+ (free for commercial use including ads as of April 2025). Bundled via npm, inlined into the build.
- **≤50KB sizes:** CSS-only template. Zero JS bytes.
- **Never:** Lottie loaded from lottiefiles.com (CORS rejected by Google Ads). If Lottie is needed, inline the JSON — that template lands in V1.
- **Never:** Rive runtime, raw Canvas, or WebGL on programmatic display (DSPs reject).

See [references/ANIMATION.md](./references/ANIMATION.md) for the full decision tree.

## Networks supported

MVP: Google Ads, DV360, The Trade Desk, Adform. V1: Amazon DSP (2x retina).

Per-network differences (manifest, polite-load, retina, clickTag case) are handled in `scripts/package.js` driven by [references/NETWORK_SPECS.md](./references/NETWORK_SPECS.md).

## Fonts

Bundle only Fontsource families (OFL, Apache, Ubuntu Font License). Self-hosted only — **never** hit `fonts.googleapis.com` at runtime (GDPR).

**Refuse:** Helvetica, Futura, any Adobe Fonts family, any foundry font (Monotype, H&Co, Commercial Type). Substitute Inter / Figtree / Manrope and log a warning.

See [references/LEGAL.md](./references/LEGAL.md) for the full font rule.

## Images

MVP: user-supplied hero image only.

V1: optional AI generation via Nano Banana (Gemini 2.5 Flash Image) or FLUX.1 schnell (Apache 2.0). **Never** FLUX.1 dev — non-commercial. See [references/IMAGE_MODELS.md](./references/IMAGE_MODELS.md). AI output triggers C2PA metadata preservation; stripping it violates platform policy.

## Failure modes to watch

1. **Puppeteer first-run download** — ~170MB Chromium. Warn the user before first `npm install`.
2. **gifski not installed** — `optionalDependencies` in package.json; render.js falls back to ffmpeg-only if missing and logs a quality warning.
3. **Config missing `clickUrl`** — refuse to build. clickTag without a URL is useless.
4. **Config references a font not in `assets/fonts/`** — warn and substitute.
5. **Hero image missing** — build proceeds with a neutral placeholder, validator flags it.
6. **Figma MCP write-back fails (free seat)** — log warning, write config to disk, continue.
7. **Network name typo** — package.js lists valid networks and exits.

## Progressive disclosure

Everything above is the in-context reference. Deeper material lives in `references/` and is loaded only when needed:

- [references/SIZES.md](./references/SIZES.md) — canonical size table, per-network availability, file-size ceilings.
- [references/NETWORK_SPECS.md](./references/NETWORK_SPECS.md) — manifest shapes, polite-load, retina, clickTag case per network.
- [references/CLICKTAG.md](./references/CLICKTAG.md) — the exact dual-global snippet and per-network variations.
- [references/ANIMATION.md](./references/ANIMATION.md) — GSAP vs CSS vs Lottie decision tree, timing conventions.
- [references/IMAGE_MODELS.md](./references/IMAGE_MODELS.md) — Nano Banana, FLUX, Imagen, licensing, watermark risk.
- [references/LEGAL.md](./references/LEGAL.md) — AI disclosure, font licensing, trademark, FTC/DSA/EU AI Act.

## Success criteria

A successful run produces, for each size:

- An `index.html` that stands alone (no external CDN except the clickTag bridge)
- A `backup.png` under 40KB
- A GIF preview (optional) and MP4 preview (optional)
- A per-network zip under 150KB with manifest + polite-load + dual clickTag
- A validation report entry of `pass` or `pass-with-warnings`

Fail loudly. Never ship a banner that the validator flags without telling the user.

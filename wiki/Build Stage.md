---
tags: [pipeline, stage, build]
stage: 1
---

# Build Stage

**Script:** [`scripts/build.js`](../scripts/build.js)
**Reads:** `banner.config.json`
**Writes:** `build/<size>/index.html`, `build/<size>/assets/*`, `build/<size>/meta.json`

## What it does

For each size in `config.sizes`:

1. Pick a template (gsap / css-only / static) via [[Animation Rules|the routing rule]].
2. Load the HTML, CSS, and (for GSAP) animation.js templates.
3. Optimize referenced assets (hero JPG/PNG via sharp; logo SVG via svgo).
4. Compute a per-size layout (padding, font sizes, gap) from the size's shape.
5. Interpolate the config + layout into the templates.
6. Minify the CSS with csso and the JS with terser (reserving `clickTag`/`clickTAG`/`__BANNER__` globals).
7. Write `index.html` with GSAP inlined and the animation code inlined after it.
8. Write a `meta.json` sidecar for downstream stages.

## Per-size layout heuristics

`scripts/lib/sizes.js:layoutFor()` maps each size's **shape** to a typography + spacing table. Shapes are:

- `rectangle` — 300×250, 336×280
- `skyscraper-wide` — 300×600
- `leaderboard` — 728×90
- `leaderboard-xl` — 970×90
- `billboard` — 970×250
- `skyscraper` — 160×600
- `skyscraper-narrow` — 120×600
- `mobile-banner` — 320×50, 300×50
- `mobile-banner-xl` — 320×100
- `banner-legacy` — 468×60
- `portrait` — 300×1050
- `square` — 250×250
- `square-small` — 200×200

Each row defines: `padding`, `gap`, `headlineSize`, `subheadSize`, `ctaSize`, `ctaPaddingY`, `ctaPaddingX`, `ctaRadius`, `logoMaxWidth`, `headlineMaxWords`.

**Why heuristics and not typography calculation:** readability at tiny sizes requires hand-tuned values. 13pt headline at 300×50 works; 13pt at 970×250 looks like a bug. Algorithmic sizing (e.g. "10% of height") reliably produces unreadable extremes.

## Headline truncation

Long headlines get word-truncated per size via `headlineMaxWords`. The skill cuts on a word boundary and appends "…". Example:

- Config: `"Spring savings, sharper than ever, across the entire spring line"`
- 300×250 (headlineMaxWords 7): `"Spring savings, sharper than ever, across the…"`
- 320×50 (headlineMaxWords 4): `"Spring savings, sharper than…"`

For V1, this becomes Claude-aided — the skill asks Claude to write size-specific variants that respect each shape's word budget rather than truncating mechanically.

## Template interpolation

Uses a tiny in-house mustache-ish engine in `scripts/lib/template.js`. Supports:

- `{{varName}}` — HTML-escaped interpolation
- `{{obj.nested.path}}` — dotted path
- `{{#if key}}...{{/if}}` — conditional blocks

HTML-escaping is on for string values (headline, cta, etc.) to prevent XSS via config. A separate `renderRaw()` exists for CSS/JS content where we've already prepared the content ourselves.

## GSAP inlining

The GSAP bundle (`node_modules/gsap/dist/gsap.min.js`, ~25KB minified) is read from disk and inlined inside the final `<script>` block. No external CDN request. Ad networks forbid external scripts beyond measurement pixels.

If GSAP isn't installed (e.g. dev environment with no `npm install` yet), build.js warns and proceeds with an empty GSAP block — the CSS-only template still works.

## Asset pipeline

- **Hero JPG/JPEG:** sharp → mozjpeg, quality 72, progressive.
- **Hero PNG:** sharp → palette, quality 72, compression level 9.
- **Logo SVG:** svgo multipass.
- **Anything else:** straight copy.

Files land in `build/<size>/assets/`. The generated HTML references them as `assets/hero.jpg`, `assets/logo.svg`.

## meta.json sidecar

```json
{
  "size": "300x250",
  "width": 300,
  "height": 250,
  "template": "gsap",
  "ceiling": 150000,
  "clickUrl": "https://acme.example.com/...",
  "campaignName": "acme-spring-launch",
  "assets": {
    "hero": { "src": "assets/hero.jpg", "alt": "..." },
    "logo": { "src": "assets/logo.svg", "alt": "..." }
  },
  "durationMs": 6500,
  "loops": 3,
  "bytes": 42180,
  "generatedAt": "2026-04-16T19:00:00Z"
}
```

## CLI flags

```bash
node scripts/build.js                      # all sizes from config.sizes
node scripts/build.js --sizes 300x250,728x90
```

## Failure modes

- **Missing hero image** — build proceeds; neutral background. Validator flags later.
- **GSAP missing from node_modules** — warns; produces builds with empty animation block (visual is broken but structurally valid).
- **Unknown size in config** — hard error; lists supported sizes.
- **Config validation failure** — hard error; prints every problem.
- **Font file missing** — currently not checked at build time (fonts aren't embedded in MVP; assumption is the system or browser has them). V1 adds font-file packaging.

## Related

- [[Pipeline Overview]]
- [[Config Schema]]
- [[GSAP Template]] · [[CSS-only Template]] · [[Static Template]]
- [[Render Stage]] — reads the HTML this stage writes

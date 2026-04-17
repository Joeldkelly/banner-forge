# banner-forge

> One Figma frame. Every banner size. Zero manual exports.

[![License](https://img.shields.io/badge/license-Apache_2.0-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![Status](https://img.shields.io/badge/status-alpha-orange)](#roadmap)

A Claude Code skill that turns one brand config (or Figma frame) into a complete, network-ready campaign across 15+ IAB display sizes, with GSAP animation, dual clickTag, Puppeteer-rendered backup images, and pass-validated zips for Google Ads, DV360, The Trade Desk, and Adform.

## Install

```bash
# clone and install
git clone https://github.com/joeldkelly/banner-forge
cd banner-forge
npm install

# or as a Claude Code plugin (once published)
claude plugin install joeldkelly/banner-forge
```

## Quick start (no Figma required)

1. Copy the example config: `cp banner.config.example.json banner.config.json`
2. Edit `banner.config.json` — brand colors, fonts, copy, hero image path, sizes, networks.
3. Run the pipeline: `npm run all`
4. Deliverables land in `./build/` and per-network zips in `./dist/`.

End-to-end on 15 sizes: under 60 seconds on a modern laptop (after first Puppeteer cache).

## Pipeline

```
banner.config.json
        │
        ▼
  build.js   →  ./build/<size>/index.html + assets
        │
        ▼
 render.js   →  ./build/<size>/backup.jpg (mozjpeg, ≤40KB), preview.gif, preview.mp4
        │
        ▼
package.js   →  ./dist/<network>/<size>.zip (with manifest + clickTag)
        │
        ▼
validate.js  →  ./dist/validation-report.json
```

Each stage reads JSON sidecars from the previous. Stages are independently re-runnable.

## Slash commands

- `/banner-from-figma <url>` — ingest a Figma frame and produce a config, then run the pipeline.
- `/banner-from-brief <path>` — ingest a brief (markdown / text) and synthesize a config.
- `/banner-resize <master-dir>` — resize an existing build to a new size set.
- `/banner-animate <banner-dir>` — swap or regenerate animation on an existing build.
- `/banner-qa <zip-or-dir>` — run validation only.
- `/banner-export <dir> --network google|dv360|ttd|adform|amazon` — repackage for one network.

## What you get

Output:

- 15 canonical IAB sizes with GSAP animation (free for ads since April 2025 — see [references/LEGAL.md](./references/LEGAL.md))
- Per-network zips: Google Ads, DV360, The Trade Desk, Adform (Amazon DSP, CM360 Studio, Sizmek, Xandr: V1)
- Dimension-locked mozjpeg backup images targeting the CM360 40 KB ceiling
- Animated GIF + MP4 previews of each build

The stuff that breaks in ad ops, already handled:

- **Dual `clickTag` + `clickTAG` globals** — one zip passes Google, DV360, TTD, Adform (see [references/CLICKTAG.md](./references/CLICKTAG.md))
- **`<meta name="ad.size">` injected automatically** — CM360 silently disapproves HTML5 creatives without it
- **`__MACOSX/`, `.DS_Store`, `Thumbs.db` stripped at zip time** — macOS Finder's "Compress" injects these and breaks DV360 uploaders
- **Zero-byte files filtered** — inflate IAB LEAN ≤15 request budget without adding value
- **`index.html` at zip root depth 0** — enforced; any deeper nesting fails validation
- **`fonts.googleapis.com` rejected** — GDPR (LG München 2022)
- **`http://` mixed-content refs rejected** — most DSPs reject; Safari blocks
- **GSAP `repeat: -1` rejected at build time** — Google/DV360/TTD enforce ≤3 loops
- **`prefers-reduced-motion` auto-variant** — WCAG 2.3.3 respected via CSS media query + GSAP short-circuit
- **Adform `manifest.json` at zip root** — generated with the exact clicktags block Adform's adapter expects
- **Gzip-aware weight reported alongside raw bytes** — Google Studio measures gzipped; most publishers enforce raw

Validator output is `dist/validation-report.json`: pass / pass-with-warnings / fail per zip with the reason.

## Customize

- [references/SIZES.md](./references/SIZES.md) — add custom sizes to the canonical table.
- [templates/](./templates/) — swap animation patterns (GSAP, CSS-only, static).
- [banner.config.example.json](./banner.config.example.json) — brand tokens, fonts, per-network overrides.

## GSAP license note

GSAP 3.13+ is 100% free for commercial use including ads as of April 2025 (post-Webflow acquisition). Every previously paid plugin (SplitText, MorphSVG, DrawSVG, ScrollTrigger) is now bundled. Ad-ops teams citing the old "Business Green" tier are working from stale documentation. See [gsap.com/licensing](https://gsap.com/licensing/).

## Why open source

I spent 15 years shipping banner campaigns. Resizing was half the job. Now it's a Claude skill. Free.

I help agencies and in-house teams build custom Claude skills for their creative workflows. [Book a call.](https://joel.design/consulting)

## Not a Pencil affiliate

banner-forge is an independent open-source project. It is compared to Pencil (Brandtech Group), AdCreative.ai, Bannerify, and others only for positioning. Those marks belong to their respective owners.

## Roadmap

- **MVP (v0.1)** — config-driven pipeline, 15 IAB sizes, GSAP, dual clickTag, Google/DV360/TTD/Adform zips, validation, backup PNG.
- **V1 (v0.2)** — Figma MCP ingest, Nano Banana image generation, copy variation matrix, Meta/LinkedIn/TikTok static + video paths, Amazon DSP, trafficking spec PDF.
- **V2 (v0.3+)** — brand-book ingestion, DCO-lite feed automation, performance heuristics, Kling/Veo video, plugin-marketplace verified badge.

## License

Apache 2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Disclaimer

This skill generates ad creative using third-party AI models and libraries. You are responsible for ad claim truthfulness, platform AI-disclosure compliance (Meta, TikTok, YouTube), IP clearance on brand names, logos, likenesses, fonts, and reference images, and FTC / state / EU DSA / EU AI Act compliance. AI-generated imagery is generally not copyrightable in the US without meaningful human authorship. See [references/LEGAL.md](./references/LEGAL.md).

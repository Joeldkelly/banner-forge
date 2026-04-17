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
 render.js   →  ./build/<size>/backup.png, preview.gif, preview.mp4
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

- 15 canonical IAB sizes with GSAP animation and dual `clickTag` / `clickTAG` globals
- Per-network zips: Google Ads, DV360, The Trade Desk, Adform (Amazon DSP in V1)
- Static PNG backup images under 40KB (sharp-optimized)
- Animated GIF + MP4 previews of each build
- Validation report covering file size, clickTag presence, asset count, and manifest correctness

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

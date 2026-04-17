---
tags: [meta, overview]
---

# Project Overview

## What banner-forge is, in one paragraph

A Claude Code skill that takes one brand configuration file (colors, fonts, headline, CTA, logo, hero image) and generates 60 finished banner ads — 15 IAB sizes × 4 ad networks — as zipped HTML5 files, each with the right manifest, clickTag, and animation for its network. Pipeline runs in under a minute. Free, open source, Apache 2.0. Lives under [[Joel Kelly]]'s brand at joel.design, funnels to a consulting offer.

## What problem it solves

Designers lose **6 to 40 hours per campaign** to manual resizing. Santa Cruz Software's 2024 survey: 85% struggle with banner resizing, 52% spend 30+ hours/week on it. Every campaign means opening Figma or Photoshop, duplicating the master, shrinking it to 15 different rectangles, exporting each, then packaging them per network with the right `clickTag` variables and `manifest.json` files.

banner-forge replaces that day with one `npm run all` command.

## The market context

- **Pencil** (Brandtech) is the commercial incumbent. Pivoted to enterprise; alienated SMB and mid-market.
- **AdCreative.ai, Bannerify** exist but none are open source.
- **GSAP went fully free in April 2025** — the single biggest technical licensing blocker is gone. See [[GSAP License Myth]].
- **No serious open-source prior art** for an AI-native banner pipeline as of early 2026.
- Estimated window before a funded team ships a similar product: ~6 months.

## What it *actually* produces

Point at a config. Get back:

```
./build/
  300x250/
    index.html      (GSAP-animated, clickTag-wired)
    assets/         (hero, logo, per-size)
    backup.png      (final frame, <40KB)
    preview.mp4     (full animation)
    preview.gif     (if gifski installed)
    meta.json       (sidecar metadata)
  336x280/ ...
  [... 15 sizes ...]

./dist/
  google/
    300x250.zip     (polite-load, clickTag lowercase)
    [... 15 ...]
  dv360/    [... 15 ...]
  ttd/      [... 15 ...]
  adform/   [... 15 ...]   (+ manifest.json in each)
  validation-report.json    (pass/warn/fail per zip)
```

## The four stages

See [[Pipeline Overview]] for the detailed flow.

1. [[Build Stage]] — config + templates → per-size HTML
2. [[Render Stage]] — Puppeteer → PNG backup, MP4, GIF
3. [[Package Stage]] — zip per (size, network) with correct manifest
4. [[Validate Stage]] — checks size ceilings, clickTag, external refs, manifest shape

## Who it's for

- Freelance designers shipping display campaigns
- Agency creatives tired of resizing days
- Marketing teams fed up with Pencil's 50-generation monthly cap
- Developers building custom creative pipelines

## Who it's **not** for

- Meta / Instagram / TikTok feed creative — those platforms refuse HTML5. V1 adds a static + video path specifically for them.
- Rich-media expandables with game-like interactivity — out of scope.
- Video-first campaigns (CTV, pre-roll) — different tool entirely.

## The skill is the funnel

The skill is free. The business is [[Consulting Funnel|consulting]]. Every piece of copy, every README decision, every landing-page CTA pushes toward *"book a call — I'll build a custom skill for your agency's workflow."* Open-source distribution compounds on Joel's personal brand, not a product brand.

## Related

- [[Glossary]] — jargon defined
- [[Naming and Positioning]] — why "banner-forge," why "replace the resizing day"
- [[Roadmap]] — what ships and when
- [[Decisions Log]] — the trail of judgment calls

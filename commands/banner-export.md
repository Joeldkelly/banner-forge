---
description: Re-package an existing build for one specific ad network with the correct manifest, clickTag case, and polite-load pattern.
argument-hint: <build-dir> --network google|dv360|ttd|adform|amazon
---

# /banner-export

Package an existing `./build/` for a single network. Use when one network rejected the zip and you need to repackage just that one.

## Usage

```
/banner-export ./build --network adform
/banner-export ./build/300x250 --network google
```

## What happens

1. Reads `banner.config.json` and `references/NETWORK_SPECS.md`.
2. For each size in the target build dir, re-runs the packaging step of `scripts/package.js` with the network-specific settings:
   - **google / dv360** — zip root with `index.html`, standard `clickTag` global, polite-load pattern where initial assets ≤ 150KB.
   - **ttd** — zip root with `index.html`, both `clickTag` and `clickTAG` globals (legacy uppercase required).
   - **adform** — zip root with `index.html` **and** `manifest.json`. Manifest declares source, dimensions, clickTag variable, and initial load assets.
   - **amazon** — 2x retina variants for 320x50 and 414x125, MP4 instead of GIF preview.
3. Writes `dist/<network>/<size>.zip` overwriting only that network's outputs.
4. Appends validation entries for the repackaged zips.

## When to use this vs. the full pipeline

- Full pipeline (`npm run all`): first build, or after a config change.
- `/banner-export`: one network rejected a zip, or you're adding a new network to an existing campaign.

---
tags: [domain, networks, dsp]
---

# Ad Networks

Which networks banner-forge targets, and what each demands. Code truth lives in `scripts/lib/networks.js`; long-form in [references/NETWORK_SPECS.md](../references/NETWORK_SPECS.md).

## Summary

| Network       | Initial load | Total load | clickTag case     | Manifest         | Retina       |
|---------------|--------------|------------|-------------------|------------------|--------------|
| Google Ads    | 150 KB       | 2.2 MB     | lowercase         | —                | no           |
| DV360         | 150 KB       | 2.2 MB     | lowercase         | —                | no           |
| The Trade Desk| 200 KB       | 2.5 MB     | both              | —                | no           |
| Adform        | 200 KB       | 2.5 MB     | both              | `manifest.json`  | no           |
| Amazon DSP    | 200 KB       | 2.5 MB     | lowercase         | —                | 320×50, 414×125 |

## Google Ads / Google Display Network

The largest single banner-ad destination. What banner-forge ships:

- `index.html` at zip root.
- `assets/` subdirectory for images/fonts.
- `backup.png` at root.
- No manifest.
- Single `clickTag` lowercase global (we ship both for forward compatibility).
- **Polite-load ceiling 150 KB.** Initial load must fit; additional assets load after `window.load` (V1).

**Important:** Google's old H5 Validator is deprecated. Don't depend on it. banner-forge uses its own [[Validate Stage]] checks (size, clickTag casing, `ad.size`, junk strip, gzip weight, mixed-content).

## Display & Video 360

DSP arm of Google. Identical rules to Google Ads for our purposes. Same zip works. Same ceilings.

## The Trade Desk

A major independent DSP. Rules:

- `clickTag` **and** `clickTAG` — legacy adapters read the uppercase form. Missing uppercase means some adapters fail silently — see [[clickTag Pattern]].
- No manifest.
- Polite-load 200 KB (more generous than Google).

banner-forge ships both globals by default, so one zip satisfies both Google and TTD.

## Adform

Popular in Europe. The only network that requires a manifest:

- `manifest.json` **must** be at zip root. Shape:
  ```json
  {
    "version": "1.0",
    "title": "...",
    "width": 300,
    "height": 250,
    "events": { "enabled": true, "list": { "1": { "name": "clickTag", "type": "interaction" } } },
    "clicktags": { "clickTag": "https://..." },
    "source": "index.html"
  }
  ```
- Both `clickTag` and `clickTAG` required.
- `scripts/package.js` generates the manifest from `meta.json` automatically.

## Amazon DSP

Retail-media-focused DSP. V1 work:

- `clickTag` lowercase only.
- No manifest.
- **2x retina** for 320×50 and 414×125 slots. Means the source image is twice the display dimensions (640×100, 828×250) and CSS downscales. banner-forge v0.1 doesn't handle retina; V1 adds a `--retina` flag to package.js.
- Polite-load 200 KB.
- Prefers MP4 preview over GIF.

## Networks we don't (yet) target

- **Criteo, Xandr** — major DSPs planned for V2.
- **Yahoo, Verizon** — declining inventory; low priority.
- **Microsoft Advertising** — typically accepts Google-format zips; explicit support is a small V2 polish.
- **Meta, TikTok, LinkedIn** — refuse HTML5. V1 adds a static + video delivery path.

## How the network choice flows through the pipeline

1. **User edits `config.networks`** — e.g., `["google", "adform"]`.
2. **Build stage** — generates `index.html` identically regardless of networks. Networks differ only at packaging.
3. **Package stage** — for each network, reads the rules from `scripts/lib/networks.js`, builds a zip with the right manifest/shape.
4. **Validate stage** — checks each zip against its target network's rules (ceilings, manifest presence, clickTag case).

## Changing networks

Adding a network:

1. Add an entry to `NETWORKS` in `scripts/lib/networks.js` (label, manifest, clickTagCase, ceilings, allowed assets, retina).
2. If it requires a manifest shape, add a generator like `adformManifest()`.
3. Add packaging logic in `scripts/package.js` (typically a switch on `network.manifest`).
4. Add a row to the summary table above.
5. Document any network-specific quirks in [references/NETWORK_SPECS.md](../references/NETWORK_SPECS.md).

## Related

- [[clickTag Pattern]]
- [[Package Stage]]
- [[Validate Stage]]
- [[IAB Sizes]]

# Network specs

Rules by network. Code reads from `scripts/lib/networks.js` — keep this doc and that file in sync.

## Summary table

| Network       | Initial load | Total load | clickTag case     | Manifest         | Polite-load | Retina       |
|---------------|--------------|------------|-------------------|------------------|-------------|--------------|
| Google Ads    | 150 KB       | 2.2 MB     | lowercase         | —                | required    | no           |
| DV360         | 150 KB       | 2.2 MB     | lowercase         | —                | required    | no           |
| The Trade Desk| 200 KB       | 2.5 MB     | both (lower+UPPER)| —                | recommended | no           |
| Adform        | 200 KB       | 2.5 MB     | both              | `manifest.json`  | required    | no           |
| Amazon DSP    | 200 KB       | 2.5 MB     | lowercase         | —                | required    | 320×50, 414×125 |

## Per-network notes

### Google Ads / Google Display Network

- `index.html` at zip root. No subdirectories in the zip root. Supporting assets in `assets/`.
- Single `clickTag` lowercase global.
- Polite-load: initial load cannot exceed 150 KB. Additional assets can be loaded lazily but total ≤ 2.2 MB.
- Google's H5 Validator is **deprecated** — don't rely on it. banner-forge uses its own `scripts/validate.js`.
- No external scripts except measurement tags allowed by the advertiser's account.

### Display & Video 360

- Identical rules to Google Ads for the MVP purpose. DV360 accepts the same zips.

### The Trade Desk

- Both `clickTag` and `clickTAG` must be declared globals. Older TTD adapters read the uppercase form.
- No `manifest.json` required.
- Initial-load ceiling is 200 KB (more lenient than Google).

### Adform

- `manifest.json` **required** at zip root with the shape below.
- Both `clickTag` and `clickTAG` globals.
- Initial-load ceiling 200 KB, total 2.5 MB.

#### Adform `manifest.json` shape

```json
{
  "version": "1.0",
  "title": "Acme Spring Launch 300x250",
  "description": "Acme Spring Launch display banner 300x250",
  "width": 300,
  "height": 250,
  "events": { "enabled": true, "list": { "1": { "name": "clickTag", "type": "interaction" } } },
  "clicktags": { "clickTag": "https://example.com/landing" },
  "source": "index.html"
}
```

### Amazon DSP

- Requires 2x retina source for the mobile 320×50 and the Amazon-specific 414×125 slot. The source PNG/JPG should be twice the display dimensions; CSS sets display size.
- MP4 preview preferred over GIF.
- Polite-load required.

## Polite-load pattern

"Polite load" = initial HTML + critical CSS + first-frame image ≤ ceiling. Remaining assets (GSAP bundle, hero image at full quality, additional fonts) are loaded after `window.load`.

banner-forge's MVP inlines GSAP into `index.html` and counts that as initial load. For V1, we'll introduce a two-file pattern (`index.html` stub + `polite.js` loaded after `load`) for campaigns that need the polite-load path explicitly.

## External requests

**Do not load** any external URL from the ad except:

- The clickTag redirect (user gesture, window.open).
- Measurement pixels explicitly whitelisted by the advertiser.

**Never** load fonts from `fonts.googleapis.com` (GDPR). Self-host via Fontsource. The validator checks for this string and fails the zip if found.

## Trafficking notes (V1)

The V1 spec sheet PDF will include:
- One row per (network, size) zip
- File name, bytes, dimensions, duration, loops, clickTag value
- File checksums (SHA-256 short)
- Contact info for traffic questions

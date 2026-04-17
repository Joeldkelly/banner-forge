---
tags: [pipeline, stage, package]
stage: 3
---

# Package Stage

**Script:** [`scripts/package.js`](../scripts/package.js)
**Reads:** `build/<size>/index.html`, `build/<size>/assets/`, `build/<size>/backup.png`, `build/<size>/meta.json`
**Writes:** `dist/<network>/<size>.zip`, `dist/package-report.json`

## What it does

For each (network, size) pair in the config:

1. Create `dist/<network>/`.
2. Read network rules from `scripts/lib/networks.js`.
3. Build a zip with:
   - `index.html` at zip root
   - `assets/` subdirectory
   - `backup.png` at zip root
   - `manifest.json` at zip root (Adform only)
4. Write to `dist/<network>/<size>.zip`.
5. Log byte count and polite-load status.

## Why a zip per (network, size)

Every DSP has slightly different rules — see [[Ad Networks]]. The most efficient way to satisfy all four is to ship separate zips per network. A single "universal" zip would need to carry all manifest variants and use the highest-compatibility subset, sacrificing 10–20% file size.

Trade-off: more zips means more files to upload per campaign (15 sizes × 4 networks = 60 zips). Agencies accept this because:

- Filenames are predictable (`dist/adform/300x250.zip`)
- Upload UIs accept bulk selection
- Per-network zips are the industry standard

## Network-specific packaging

### Google Ads / DV360

Zip layout:
```
index.html
assets/hero.jpg
assets/logo.svg
backup.png
```

No manifest. `clickTag` lowercase only (though we always ship both). Polite-load ceiling 150KB.

### The Trade Desk

Same zip layout as Google. No manifest. `clickTag` + `clickTAG` both required — shipped by default.

### Adform

```
index.html
assets/hero.jpg
assets/logo.svg
backup.png
manifest.json    ← required
```

`manifest.json` shape from `scripts/lib/networks.js:adformManifest()`:

```json
{
  "version": "1.0",
  "title": "acme-spring-launch 300x250",
  "description": "acme-spring-launch display banner 300x250",
  "width": 300,
  "height": 250,
  "events": { "enabled": true, "list": { "1": { "name": "clickTag", "type": "interaction" } } },
  "clicktags": { "clickTag": "https://acme.example.com/..." },
  "source": "index.html"
}
```

### Amazon DSP (V1)

Similar to Google but with 2x retina for `320x50` and `414x125` slots. V1 extension.

## Compression

```js
archiver("zip", { zlib: { level: 9 } })
```

Max compression. The `archiver` npm package handles everything — no external binary.

## CLI flags

```bash
node scripts/package.js                         # all (network × size) from config
node scripts/package.js --network adform
node scripts/package.js --sizes 300x250,728x90
node scripts/package.js --network ttd --sizes 300x250,300x600
```

## package-report.json

```json
{
  "generatedAt": "...",
  "entries": [
    {
      "network": "google",
      "size": "300x250",
      "zipPath": "dist/google/300x250.zip",
      "bytes": 87432,
      "ceilingOk": true,
      "politeLoadOk": true
    },
    ...
  ]
}
```

`ceilingOk` — within network's total-load ceiling.
`politeLoadOk` — within initial-load ceiling. (Same zip, different thresholds per network.)

## Failure modes

- **Missing build** — skipped with a warning. Run `build.js` first.
- **Unknown network** — hard error; lists supported.
- **Zip exceeds ceiling** — packaged anyway; validator flags it in the next stage. We don't block here because the user might intentionally be over.

## What's *not* in the zip

- No source maps.
- No font files (MVP — V1 adds per-font embedding).
- No `package.json` or any build metadata.
- No frame-sequence directory from render (.frames is cleaned up).

## Related

- [[Build Stage]]
- [[Render Stage]]
- [[Validate Stage]] — inspects zips this writes
- [[Ad Networks]] — the rule differences driving per-network zips
- [[clickTag Pattern]]

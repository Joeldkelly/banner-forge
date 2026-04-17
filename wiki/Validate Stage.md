---
tags: [pipeline, stage, validate]
stage: 4
---

# Validate Stage

**Script:** [`scripts/validate.js`](../scripts/validate.js)
**Reads:** every zip under `dist/`
**Writes:** `dist/validation-report.json`

## What it does

For each zip in `dist/<network>/<size>.zip`:

1. Check file size against the network's initial-load and total-load ceilings.
2. Parse the zip's central directory to list files (minimal in-house zip reader).
3. Confirm `index.html` exists at zip root.
4. If targeting Adform, confirm `manifest.json` exists at zip root.
5. Decompress and inspect `index.html`:
   - Both `clickTag` (lowercase) and `clickTAG` (uppercase) declared where required.
   - Click URL is a non-empty `http(s)://` URL.
   - No runtime calls to `fonts.googleapis.com` (GDPR).
   - External script/link refs flagged as warnings.
6. Classify as `pass` / `pass-with-warnings` / `fail`.
7. Print a human-readable summary to stdout.
8. Write the full report to `dist/validation-report.json`.
9. Exit 0 (all pass/warn) or 1 (any fail) or 2 (validator errored).

## What it checks (in order of cost)

### File size

- Zip over network's **total-load ceiling** → **fail** (ad won't serve).
- Zip over **initial-load (polite-load) ceiling** → **warning** (may affect serve rate).

Per-network ceilings from `scripts/lib/networks.js`:

| Network | Initial | Total |
|---------|---------|-------|
| Google  | 150 KB  | 2.2 MB |
| DV360   | 150 KB  | 2.2 MB |
| TTD     | 200 KB  | 2.5 MB |
| Adform  | 200 KB  | 2.5 MB |
| Amazon  | 200 KB  | 2.5 MB |

### Required files

- `index.html` at zip root — **fail** if missing.
- `manifest.json` at zip root — **fail** if network is `adform` and missing.

### clickTag presence

- `/\bvar\s+clickTag\s*=/` must match in `index.html` — **fail** if missing.
- For `ttd` and `adform`: `/\bvar\s+clickTAG\s*=/` must also match — **fail** if missing.
- See [[clickTag Pattern]].

### Click URL validity

- Extracted from `var clickTag = "..."`.
- Empty string → **fail**.
- Non-http(s) URL → **fail**.

### External requests

- `fonts.googleapis.com` in `index.html` → **fail** (GDPR). See [[Fonts Licensing]].
- Any other external `<script src>` or `<link href>` → **warning** (listed in report).

## Why we roll our own zip reader

`scripts/validate.js` parses the zip central directory directly using Node's built-in `zlib` module. ~80 lines of code. We avoid adding `adm-zip` or `yauzl` as a dependency because:

- We only need to find `index.html`, decompress it, and list entries.
- No write path.
- Dep-creep matters for a one-click-install skill.

See [[Decisions Log]].

## The validation-report.json shape

```json
{
  "generatedAt": "2026-04-16T19:00:00Z",
  "pass": 47,
  "warn": 8,
  "fail": 5,
  "entries": [
    {
      "network": "google",
      "size": "300x250",
      "zipPath": "dist/google/300x250.zip",
      "bytes": 87432,
      "status": "pass",
      "warnings": [],
      "failures": []
    },
    {
      "network": "adform",
      "size": "970x250",
      "zipPath": "dist/adform/970x250.zip",
      "bytes": 173441,
      "status": "fail",
      "warnings": [],
      "failures": ["clickTAG (uppercase) missing — required by TTD/Adform"]
    }
  ]
}
```

## CLI flags

```bash
node scripts/validate.js                              # every zip under dist/
node scripts/validate.js --target dist/google/300x250.zip
```

## Exit codes

- `0` — all zips `pass` or `pass-with-warnings`
- `1` — one or more `fail` entries
- `2` — validator itself errored (bad zip, bad path, etc.)

`build-all.sh` stops at exit 1; individual validation runs from `/banner-qa` return the code to Claude which surfaces it to the user.

## What's *not* checked (yet)

- **Animation duration** — planned for V1 via a Puppeteer re-inspection step.
- **Loop count** — same.
- **Image embedded watermarks** — V1 via simple pattern-matching. See [[AI Disclosure]].
- **Font file size per embedded font** — V1 when font packaging lands.
- **Cross-browser rendering** — out of scope; Chromium-only in ads.
- **Landing page resolves** — out of scope; advertiser's responsibility.

## Related

- [[Package Stage]] — produces zips this reads
- [[clickTag Pattern]]
- [[Ad Networks]]
- [[Pipeline Overview]]

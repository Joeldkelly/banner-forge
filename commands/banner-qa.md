---
description: Run validation only against an existing banner zip or build directory. No rebuild. Use for spot-checking or pre-delivery sanity.
argument-hint: <zip-file-or-build-dir>
---

# /banner-qa

Validate existing banner output against network rules. Does not rebuild.

## Usage

```
/banner-qa ./dist/google/300x250.zip
/banner-qa ./build/300x250
/banner-qa ./dist
```

## What it checks

- **File size:** raw bytes against network initial/total-load ceilings; gzipped weight reported alongside.
- **IAB LEAN budget:** ≤15 initial-load requests (Google/DV360/CM360); ≤20 (TTD/Adform/Amazon).
- **clickTag presence:** `var clickTag` (lowercase) required; `var clickTAG` (uppercase) required for TTD/Adform. clickUrl must be valid `https://`.
- **`<meta name="ad.size">`:** required — CM360 silently disapproves without it.
- **Required files:** `index.html` at zip root depth 0; Adform `manifest.json` when targeting Adform.
- **Junk files rejected:** `__MACOSX/`, `.DS_Store`, `Thumbs.db` break DV360/CM360 uploaders.
- **Zero-byte files rejected:** inflate request count without adding value.
- **Mixed content rejected:** `http://` references in `<script>` / `<link>` / `<img>` / `<iframe>` / `<source>`.
- **Font refs:** every font family self-hosted; `fonts.googleapis.com` at runtime is a failure (GDPR).
- **`repeat: -1` rejected:** infinite loops violate the ≤3-loop cap on Google/DV360/TTD.

## Output

Writes (or appends to) `dist/validation-report.json`:

```json
{
  "generatedAt": "2026-04-16T19:00:00Z",
  "entries": [
    {
      "size": "300x250",
      "network": "google",
      "zipPath": "dist/google/300x250.zip",
      "bytes": 87432,
      "status": "pass",
      "warnings": [],
      "failures": []
    }
  ]
}
```

Prints a human-readable summary to stdout with pass/fail counts and the top three failures.

## Exit codes

- `0` — all entries `pass` or `pass-with-warnings`
- `1` — one or more `fail` entries
- `2` — validator itself errored

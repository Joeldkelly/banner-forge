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

- **File size:** zip ≤ 150KB (Google/DV360 polite-load ceiling), individual assets ≤ their network's max.
- **clickTag presence:** both `clickTag` and `clickTAG` globals declared; `clickUrl` is a valid HTTPS URL.
- **Required files:** `index.html` at zip root, every referenced asset present, Adform `manifest.json` when targeting Adform.
- **HTML5 validity:** runs html5-validator against `index.html`.
- **Ad preflight:** runs `@ad-preflight/cli` for clickTag, polite-load, and external-request flags.
- **Font references:** every font family is from Fontsource and self-hosted (no fonts.googleapis.com at runtime).
- **Animation length:** ≤ 15s cumulative; loops ≤ 3.

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

---
tags: [architecture, pipeline]
---

# Pipeline Overview

Four stages. Each writes JSON sidecars the next one reads. Any stage can be re-run independently.

## The flow

```
banner.config.json
      │
      ▼
┌─────────────────┐
│   build.js      │   config + templates → build/<size>/index.html
└─────────────────┘
      │
      ▼
┌─────────────────┐
│   render.js     │   headless Chrome → backup.png + preview.mp4 + preview.gif
└─────────────────┘
      │
      ▼
┌─────────────────┐
│   package.js    │   per-network zips with manifest + clickTag
└─────────────────┘
      │
      ▼
┌─────────────────┐
│   validate.js   │   size, clickTag, external refs → validation-report.json
└─────────────────┘
      │
      ▼
    ./dist/  (ready to upload)
```

One-liner: `npm run all` (runs [`scripts/build-all.sh`](../scripts/build-all.sh)).

## Why file-based, not in-memory

Each stage's output is a deterministic artifact on disk. This means:

- **Resumable.** If render.js fails on size 12 of 15, the 11 completed builds are still valid. Re-run render.js with `--sizes 300x1050,468x60,…`.
- **Debuggable.** Every intermediate state is a file you can inspect. `build/300x250/index.html` opens in a browser. `build/300x250/meta.json` shows what build.js computed.
- **Parallelizable later.** When we want to scale to 200 sizes, each stage can shard by size without changing the contract.
- **Agent-friendly.** Claude can re-run one stage without re-doing the whole pipeline, which matches how [[Why One Skill Not Many|skills]] are supposed to work.

## The sidecar contract

After each stage, the output directory contains a JSON file that the next stage reads:

| Stage        | Writes                                  | Reads                         |
|--------------|-----------------------------------------|-------------------------------|
| build.js     | `build/<size>/meta.json`                | `banner.config.json`          |
| build.js     | `build/build-report.json` (summary)     | —                             |
| render.js    | adds `backup.png`, `preview.mp4`, `preview.gif` to each size dir | `build/<size>/meta.json`, `build/<size>/index.html` |
| render.js    | `build/render-report.json` (summary)    | —                             |
| package.js   | `dist/<network>/<size>.zip`             | `build/<size>/meta.json`, `build/<size>/index.html`, `build/<size>/assets/` |
| package.js   | `dist/package-report.json` (summary)    | —                             |
| validate.js  | `dist/validation-report.json`           | every `dist/<network>/<size>.zip` |

## Entry points

All stages have CLI flags for scope:

```bash
node scripts/build.js              # all sizes from config.sizes
node scripts/build.js --sizes 300x250,728x90

node scripts/render.js             # all sizes present in ./build/
node scripts/render.js --skip gif  # faster: PNG + MP4 only

node scripts/package.js            # all (network × size) from config
node scripts/package.js --network adform
node scripts/package.js --sizes 300x250,728x90

node scripts/validate.js           # every zip in ./dist/
node scripts/validate.js --target ./dist/google/300x250.zip
```

## Stage notes

- [[Build Stage]]
- [[Render Stage]]
- [[Package Stage]]
- [[Validate Stage]]

## Related

- [[File Structure]] — where each script lives
- [[Config Schema]] — what build.js reads
- [[Why One Skill Not Many]] — design philosophy

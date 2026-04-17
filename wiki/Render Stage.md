---
tags: [pipeline, stage, render]
stage: 2
---

# Render Stage

**Script:** [`scripts/render.js`](../scripts/render.js)
**Reads:** `build/<size>/index.html`, `build/<size>/meta.json`
**Writes:** `build/<size>/backup.png`, `build/<size>/preview.mp4`, `build/<size>/preview.gif`

## What it does

For each size with a finished build:

1. Launch a shared Puppeteer headless Chromium instance.
2. Open `build/<size>/index.html` in a new page sized exactly to the banner dimensions.
3. Capture sequential frames of the animation.
4. Use the last frame as the **backup image** (sharp-optimized PNG, target <40KB).
5. Encode the frames to MP4 via bundled ffmpeg.
6. Encode to GIF via gifski if present, or skip with a warning.

## Why Puppeteer

- **Native `page.screencast()`** since Chrome 120 — real MP4 encoding from the browser side.
- **Deterministic rendering** — we drive the GSAP timeline's `progress` value directly rather than relying on wallclock sleep, so each frame is captured at a predictable animation position.
- **Chromium-only is fine** for ads (no cross-browser testing needed).
- Ships with its own Chromium binary — no system Chrome required.

## Deterministic capture (GSAP path)

For GSAP builds, we:

1. Pause the global timeline.
2. For each of N frames (24 fps × duration seconds), set `gsap.globalTimeline.progress(t)` where t goes from 0 → 1.
3. `page.screenshot()` at each step.
4. Concatenate via ffmpeg.

This produces a video that exactly matches the animation the designer intended — no frame drops, no timing drift, no GPU-load jitter.

## Wallclock capture (CSS-only path)

For CSS-only builds (sizes ≤50KB), we can't drive `@keyframes` from JavaScript without rewriting them. Instead we:

1. Wait the per-frame time slice (`durationMs / totalFrames`).
2. Screenshot.
3. Repeat.

This is less deterministic on a loaded machine but works fine for the short (~2s) staggered CSS animations we use.

## Backup PNG optimization

After the last frame is captured:

1. `sharp(lastFrame).png({ quality: 80, compressionLevel: 9, palette: true })`.
2. Writes `build/<size>/backup.png`.

Palette mode is key — reduces a 200KB full-color PNG to 20–30KB for the kind of flat design typical of banners. If the source art requires truecolor (photographic hero), the result is larger; validator flags if >40KB.

## MP4 encoding

```
ffmpeg -r 24 -i f%04d.png -c:v libx264 -pix_fmt yuv420p -vf scale=trunc(iw/2)*2:trunc(ih/2)*2 -movflags +faststart preview.mp4
```

- `yuv420p` for broadest compatibility.
- `scale=trunc(iw/2)*2:trunc(ih/2)*2` to ensure even dimensions (libx264 requires it).
- `+faststart` so the MP4 can be streamed from a server without full download.

## GIF encoding (optional)

If `gifski` is available (either as `node_modules/gifski/bin/gifski` via npm, or on PATH), we encode all frames:

```
gifski -o preview.gif --fps 24 --quality 85 f0000.png f0001.png ...
```

gifski produces dramatically smaller, cleaner GIFs than imagemagick — correct alpha handling, perceptual quality optimization.

**When gifski is missing** — we log a single warning per size and skip. The pipeline continues. MP4 preview is still produced and is more useful anyway.

## CLI flags

```bash
node scripts/render.js                    # all sizes present in ./build/
node scripts/render.js --sizes 300x250
node scripts/render.js --skip gif         # skip GIF encoding
node scripts/render.js --skip gif,mp4     # backup PNG only (fastest)
```

## render-report.json

After all sizes render, a summary lands at `build/render-report.json`:

```json
{
  "generatedAt": "...",
  "entries": [
    { "size": "300x250", "backupBytes": 28420, "gifBytes": 142000, "mp4Bytes": 84200 },
    ...
  ]
}
```

## Failure modes

- **Puppeteer first-run download** — ~170MB Chromium. Warn the user before first `npm install`.
- **Page fails to load** — the stage reports the size as failed and continues to the next.
- **ffmpeg errors** — typically a bad source frame (zero-byte PNG). Re-run the build stage for that size.
- **gifski missing** — skipped; warning; MP4 is sufficient.
- **Deterministic capture fails (GSAP not loaded)** — render.js falls back to wallclock capture; some timing jitter on loaded machines.

## Why not Playwright

Playwright is excellent. We didn't pick it because:

- Puppeteer's native MP4 screencast is simpler than Playwright's trace/video flow.
- Chromium-only is a feature for ads (fewer variables).
- Smaller dep graph.

See [[Decisions Log]].

## Related

- [[Build Stage]] — what this reads
- [[Package Stage]] — reads `backup.png` that this writes
- [[Animation Rules]]

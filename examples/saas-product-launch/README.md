# Example: Northstar SaaS product launch

A config-only example (no Figma, no hero image). Shows the pipeline running end-to-end from a single JSON file.

## Run it

```bash
cd /path/to/banner-forge
cp examples/saas-product-launch/banner.config.json ./banner.config.json
npm install         # first time only; downloads Puppeteer Chromium (~170MB)
npm run all
```

Output:

- `./build/<size>/` — HTML + assets per size
- `./dist/<network>/<size>.zip` — per-network deliverables
- `./dist/validation-report.json` — pass/fail per zip

## What to expect on first run

- **Node 20+ required.** Check with `node --version`.
- **Puppeteer** downloads Chromium the first time (~170MB). If you're offline or on metered bandwidth, set `PUPPETEER_SKIP_DOWNLOAD=1` and supply your own `--executable-path`.
- **GSAP** is fetched as a regular npm dependency. It's free for commercial use; see `references/LEGAL.md`.
- **gifski** is optional. If not installed, the pipeline skips GIF preview and continues. MP4 preview still works via bundled ffmpeg-static.

## Without a hero image

This example has an empty `creative.hero.src`. Builds still succeed — the banner lays out with just the brand colors, headline, subhead, and CTA. Drop a JPG or PNG into this folder and set `creative.hero.src` to ship a real image.

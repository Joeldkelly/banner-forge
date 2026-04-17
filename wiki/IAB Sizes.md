---
tags: [domain, sizes, iab]
---

# IAB Sizes

The 15 canonical banner dimensions banner-forge ships in v0.1. Code truth lives in `scripts/lib/sizes.js`; long-form table in [references/SIZES.md](../references/SIZES.md).

## The canonical 15

| Size     | Name                 | Template  | Ceiling | Shape              |
|----------|----------------------|-----------|---------|--------------------|
| 300×250  | Medium Rectangle     | GSAP      | 150 KB  | rectangle          |
| 336×280  | Large Rectangle      | GSAP      | 150 KB  | rectangle          |
| 300×600  | Half-Page            | GSAP      | 150 KB  | skyscraper-wide    |
| 728×90   | Leaderboard          | GSAP      | 150 KB  | leaderboard        |
| 970×90   | Large Leaderboard    | GSAP      | 150 KB  | leaderboard-xl     |
| 970×250  | Billboard            | GSAP      | 150 KB  | billboard          |
| 160×600  | Wide Skyscraper      | GSAP      | 150 KB  | skyscraper         |
| 120×600  | Skyscraper (legacy)  | GSAP      | 150 KB  | skyscraper-narrow  |
| 320×50   | Mobile Leaderboard   | **CSS**   |  50 KB  | mobile-banner      |
| 320×100  | Large Mobile Banner  | **CSS**   |  50 KB  | mobile-banner-xl   |
| 300×50   | Mobile Banner        | **CSS**   |  50 KB  | mobile-banner      |
| 300×1050 | Portrait             | GSAP      | 150 KB  | portrait           |
| 468×60   | Full Banner (legacy) | **CSS**   |  50 KB  | banner-legacy      |
| 250×250  | Square               | GSAP      | 150 KB  | square             |
| 200×200  | Small Square         | **CSS**   |  50 KB  | square-small       |

## Why these 15

These are the Google Display Network's top performers and cover ~**80% of programmatic inventory**. Every DSP (DV360, TTD, Adform, Amazon) accepts them. If a campaign needs more coverage, add sizes — the size matrix is extensible.

Sources:
- Google Ads supported sizes documentation
- IAB Display Ad Guidelines 2019+
- Pre-MVP surveys of ad-ops teams

## Template routing

Any size with `ceiling ≤ 50000` (50 KB) force-routes to the [[CSS-only Template]] regardless of the config's `animation.template`. The [[GSAP Template]] bundle alone (~25 KB) eats the budget once you add HTML, CSS, hero, and logo.

`scripts/lib/sizes.js:resolveTemplate()` enforces this:

```js
if (s.ceiling <= 50000) return "css-only";
if (configTemplate === "static") return "static";
return "gsap";
```

## Layout heuristics

Each `shape` has a hand-tuned layout table in `scripts/lib/sizes.js:layoutFor()`:

- `padding`, `gap`
- `headlineSize`, `subheadSize`, `ctaSize`
- `ctaPaddingX`, `ctaPaddingY`, `ctaRadius`
- `logoMaxWidth`
- `headlineMaxWords` (for per-size truncation)

Typography scales from 13pt (mobile banner) to 36pt (billboard) headline. Mobile banners have `subheadSize: 0` — subheads are dropped entirely to preserve headline+CTA legibility.

See [[Build Stage]] for how these values flow into the templates.

## Adding a custom size

1. Add to `SIZE_MATRIX` in `scripts/lib/sizes.js`:
   ```js
   "400x400": { w: 400, h: 400, shape: "square", ceiling: 150000, template: "gsap" }
   ```
2. If the `shape` is new, add a row to the `layoutFor()` table.
3. Add to the table above.
4. Reference in `banner.config.json` under `sizes`.

## Sizes we didn't include

- **468×60 (Full Banner)** is in our MVP 15, but it's effectively legacy. Kept for inventory coverage.
- **125×125, 180×150** — obsolete.
- **1×1, 10×10** — tracking pixels, not display.

## V1 size expansions

Social native (Meta refuses HTML5; these route to static or MP4):

| Size       | Platform  | Template    |
|------------|-----------|-------------|
| 1080×1080  | Meta 1:1  | static/mp4  |
| 1080×1350  | Meta 4:5  | static/mp4  |
| 1080×1920  | Meta 9:16 | static/mp4  |
| 1200×627   | LinkedIn  | static      |
| 1080×1920  | TikTok    | mp4         |

Amazon DSP retina (2x source, delivered at display size):

| Source   | Delivered |
|----------|-----------|
| 640×100  | 320×50    |
| 828×250  | 414×125   |

## Related

- [[Config Schema]]
- [[Build Stage]]
- [[Ad Networks]]
- [[GSAP Template]] · [[CSS-only Template]] · [[Static Template]]

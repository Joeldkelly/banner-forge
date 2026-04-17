# Canonical size matrix

One source of truth for banner-forge dimensions. Code reads from `scripts/lib/sizes.js` — keep the two in sync.

## MVP 15 sizes (v0.1)

| Size       | Shape               | Ceiling | Template  | Notes                                              |
|------------|---------------------|---------|-----------|----------------------------------------------------|
| 300×250    | rectangle           | 150 KB  | gsap      | Medium Rectangle — highest-performing IAB slot     |
| 336×280    | rectangle           | 150 KB  | gsap      | Large Rectangle                                    |
| 300×600    | skyscraper-wide     | 150 KB  | gsap      | Half-page — premium inventory                      |
| 728×90     | leaderboard         | 150 KB  | gsap      | Leaderboard — above-the-fold desktop standard      |
| 970×90     | leaderboard-xl      | 150 KB  | gsap      | Large Leaderboard                                  |
| 970×250    | billboard           | 150 KB  | gsap      | Billboard — pushdown unit                          |
| 160×600    | skyscraper          | 150 KB  | gsap      | Wide Skyscraper                                    |
| 120×600    | skyscraper-narrow   | 150 KB  | gsap      | Skyscraper — legacy                                |
| 320×50     | mobile-banner       |  50 KB  | css-only  | Mobile Leaderboard — **CSS only, no GSAP**         |
| 320×100    | mobile-banner-xl    |  50 KB  | css-only  | Large Mobile Banner — **CSS only, no GSAP**        |
| 300×50     | mobile-banner       |  50 KB  | css-only  | Mobile Banner — **CSS only, no GSAP**              |
| 300×1050   | portrait            | 150 KB  | gsap      | Portrait — high-impact sidebar                     |
| 468×60     | banner-legacy       |  50 KB  | css-only  | Full Banner — legacy desktop                       |
| 250×250    | square              | 150 KB  | gsap      | Square                                             |
| 200×200    | square-small        |  50 KB  | css-only  | Small Square — **CSS only, no GSAP**               |

## Template routing rule

Any size with `ceiling ≤ 50000` (50 KB) is force-routed to `css-only` regardless of the config's `animation.template` value. The GSAP bundle alone (inlined, minified) is ~25 KB — once you add HTML, CSS, hero image, and logo, a GSAP build won't fit under 50 KB. `scripts/lib/sizes.js:resolveTemplate` enforces this.

## Adding a custom size

1. Add an entry to `SIZE_MATRIX` in `scripts/lib/sizes.js` with `w`, `h`, `shape`, `ceiling`, `template`.
2. If the `shape` is new, add a layout row in the `table` inside `layoutFor()` covering padding, gap, headline/subhead/CTA sizes, CTA radius, logo max width, and headline max words.
3. Add a row to the table above.
4. Reference the new size in `banner.config.json` under `sizes`.

## V1 additions (planned)

Social native (Meta refuses HTML5 — these route to static or MP4):

| Size       | Platform  | Template  | Notes                           |
|------------|-----------|-----------|---------------------------------|
| 1080×1080  | Meta 1:1  | static/mp4| Feed square                     |
| 1080×1350  | Meta 4:5  | static/mp4| Feed portrait                   |
| 1080×1920  | Meta 9:16 | static/mp4| Stories / Reels                 |
| 1200×627   | LinkedIn  | static    | Sponsored content               |
| 1080×1920  | TikTok    | mp4       | Feed                            |

Amazon DSP retina:

| Size            | Notes                                     |
|-----------------|-------------------------------------------|
| 320×50 @2x      | 640×100 source, delivered at 320×50       |
| 414×125 @2x     | 828×250 source, delivered at 414×125      |

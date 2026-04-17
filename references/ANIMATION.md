# Animation decision tree

When to pick GSAP, CSS-only, Lottie, or static.

## The decision

| Situation                                       | Pick       | Reason                                                    |
|-------------------------------------------------|------------|-----------------------------------------------------------|
| Default HTML5 banner on any programmatic network| **gsap**   | GSAP 3.13+ is free for ads as of April 2025.              |
| Size ≤ 50 KB target (320×50, 300×50, etc.)      | **css-only** | GSAP bundle alone (~25 KB) eats the budget.             |
| Interactive / stateful (expandables, games)     | **gsap**   | GSAP plus hand-rolled state. CSS alone can't do this.     |
| Designer hands off an After Effects comp        | **lottie (V1)** | Inlined Lottie JSON. Never loaded from lottiefiles.com (CORS rejected by Google Ads). |
| Meta, TikTok, LinkedIn Stories feed             | **mp4/static** | Those platforms refuse HTML5. Render and ship MP4 or PNG. |
| Creative is deliberately static                 | **static** | One-image zip. Still wired with clickTag.                 |

## Never

- **Rive runtime** for programmatic display. Most DSPs reject runtime `.riv` loads.
- **Raw Canvas / WebGL** on display. CPU usage triggers DV360 rejection.
- **Lottie served from lottiefiles.com.** Documented CORS rejection on Google Ads. Inline the JSON instead.

## GSAP timing conventions (MVP)

Scenes are defined in `banner.config.json` under `animation.scenes`. A sensible default set:

```json
"scenes": [
  { "id": "intro",    "durationMs": 1200, "transition": "fade"     },
  { "id": "headline", "durationMs": 2000, "transition": "slide-up" },
  { "id": "subhead",  "durationMs": 1500, "transition": "fade"     },
  { "id": "cta",      "durationMs": 1800, "transition": "scale-in" }
]
```

Constraints:

- **Total animation ≤ 15 seconds.** Google, DV360, TTD all enforce this.
- **Loops ≤ 3.** Count from the start of the first play through the end of the last. banner-forge caps at 3 via the config `animation.loops`.
- **Final frame is the static backup.** The GSAP timeline's `onComplete` sets all elements to their end state so the Puppeteer capture is deterministic.

## CSS-only timing conventions

CSS `@keyframes` can't chain scene-by-scene as cleanly as a GSAP timeline, so we use staggered delays on each element:

```css
#logo     { animation: bf-fade       0.5s 0.1s both; }
#headline { animation: bf-slide-up   0.6s 0.4s both; }
#subhead  { animation: bf-fade       0.5s 1.0s both; }
#cta      { animation: bf-scale-in   0.5s 1.5s both; }
```

Total ~2 seconds. For a 15-second spot, we add a `iteration-count: N` on the last element, or we hold the final frame and let the network's loop count drive repetition.

## Transitions supported

- `fade` — opacity 0 → 1
- `slide-up` — opacity 0 + translateY(12px) → opacity 1 + translateY(0)
- `slide-down` — opacity 0 + translateY(-12px) → opacity 1 + translateY(0)
- `scale-in` — opacity 0 + scale(0.92) → opacity 1 + scale(1), back easing
- `scale-out` — opacity 0 + scale(1.08) → opacity 1 + scale(1)

Adding more: extend `templates/gsap/animation.js` and the `@keyframes` block in `templates/css-only/styles.css`. Name prefix `bf-`.

## Backup image (required by every network)

Every banner needs a static backup. banner-forge captures it via Puppeteer at the final GSAP progress state. If the animation doesn't have a natural "end frame" (e.g. a looping logo pulse), the config should flag `animation.backupFrame` as a timestamp — out of MVP scope; v0.1 always uses the final frame.

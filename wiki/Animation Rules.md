---
tags: [domain, animation, gsap]
---

# Animation Rules

When to use GSAP, CSS-only, Lottie, MP4, or static. The decision tree and the reasoning.

## The decision

| Situation                                       | Template    | Reason                                                    |
|-------------------------------------------------|-------------|-----------------------------------------------------------|
| Default HTML5 banner on any programmatic network| [[GSAP Template\|gsap]]   | GSAP 3.13+ is free for ads as of April 2025 |
| Size ≤ 50 KB target (320×50, 300×50, etc.)      | [[CSS-only Template\|css-only]] | GSAP bundle alone (~25 KB) eats the budget |
| Interactive / stateful (expandables, games)     | gsap + state| GSAP plus hand-rolled state. CSS alone can't do this.     |
| Designer hands off an After Effects comp        | lottie (V1) | **Inlined Lottie JSON.** Never loaded from lottiefiles.com (CORS rejected by Google Ads). |
| Meta, TikTok, LinkedIn Stories feed             | mp4 / static| Those platforms refuse HTML5. Render and ship MP4 or PNG. |
| Creative is deliberately static                 | [[Static Template\|static]] | One-image zip, still wired with clickTag                |

## Never

| Don't                               | Why                                             |
|-------------------------------------|-------------------------------------------------|
| **Rive runtime** on programmatic    | Most DSPs reject runtime `.riv` loads           |
| **Raw Canvas / WebGL**              | CPU usage triggers DV360 rejection              |
| **Lottie from lottiefiles.com**     | Documented CORS rejection on Google Ads         |
| **GSAP from cdn.jsdelivr.net**      | Ad networks forbid external scripts             |
| **Fonts from fonts.googleapis.com** | GDPR issue (LG München 2022)                    |

## GSAP timing conventions

Scenes are defined in `banner.config.json` under `animation.scenes`. Sensible default:

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
- **Loops ≤ 3.** Count from the start of the first play through the end of the last.
- **Final frame = static backup.** The timeline's `onComplete` sets every element to its end state so [[Render Stage]]'s capture is deterministic.

## CSS-only timing conventions

Can't chain scenes as cleanly, so use staggered delays:

```css
#logo     { animation: bf-fade       0.5s 0.1s both; }
#headline { animation: bf-slide-up   0.6s 0.4s both; }
#subhead  { animation: bf-fade       0.5s 1.0s both; }
#cta      { animation: bf-scale-in   0.5s 1.5s both; }
```

Total ~2 seconds. For longer spots, the network's loop count drives repetition.

## Transitions supported

| Transition    | Visual                                            |
|---------------|---------------------------------------------------|
| `fade`        | opacity 0 → 1                                     |
| `slide-up`    | opacity 0 + translateY(12px) → opacity 1 + 0      |
| `slide-down`  | opacity 0 + translateY(-12px) → opacity 1 + 0     |
| `scale-in`    | opacity 0 + scale(0.92) → opacity 1 + scale(1)    |
| `scale-out`   | opacity 0 + scale(1.08) → opacity 1 + scale(1)    |

Adding a new one:
1. Branch in `templates/gsap/animation.js`.
2. Optional `@keyframes` in `templates/css-only/styles.css` for parity.
3. Name prefix `bf-` for all CSS keyframes.

## Backup image

Every network requires a static PNG backup. banner-forge captures it automatically as the final frame via Puppeteer in [[Render Stage]]. Target size <40 KB.

If the animation doesn't have a natural "end frame" (e.g. a looping logo pulse), the config should flag `animation.backupFrame` as a timestamp — out of MVP scope. v0.1 always uses the final frame.

## What makes an ad animate well

Not this project's core concern, but relevant for template defaults:

1. **Hero enters first** — scale-down or fade-in. Establishes the image.
2. **Headline slides up** — motion draws the eye to text.
3. **Subhead fades in** — secondary info, secondary motion.
4. **CTA scales in last** — the ask, held on the final frame.
5. **Logo persists** — fades in early, stays.

banner-forge's default scenes reflect this. Users can override.

## Loop cadence

Most networks enforce max 3 loops. Total ~15 seconds means each loop is ~5 seconds. Shorter spots (2-3 seconds) can loop 3 times but then hold on the final frame to fill the remaining time — this is what `onComplete` + `repeat: loops - 1` accomplishes.

## Related

- [[GSAP Template]]
- [[CSS-only Template]]
- [[Render Stage]]
- [[GSAP License Myth]]
- [references/ANIMATION.md](../references/ANIMATION.md)

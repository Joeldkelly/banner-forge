---
tags: [template, css, animation, mobile]
---

# CSS-only Template

**Location:** [`templates/css-only/`](../templates/css-only)
**Files:** `index.html`, `styles.css`
**Used for:** every size with ceiling ≤ 50KB — 320×50, 320×100, 300×50, 468×60, 200×200.

## Why it exists

Mobile banner sizes have a **50KB hard ceiling** on most DSPs. The GSAP bundle alone (inlined, minified) is ~25KB. Once you add HTML, CSS, logo, and a 10KB hero image, GSAP builds blow the budget.

The CSS-only template uses **zero JavaScript bytes** for animation — just the clickTag declaration. Animation is driven entirely by CSS `@keyframes`.

`scripts/lib/sizes.js:resolveTemplate()` force-routes these sizes to this template regardless of `config.animation.template`.

## Anatomy

### `index.html`

Same shape as the GSAP template minus the animation/GSAP scripts:

```html
<script>
  var clickTag = "{{clickUrl}}";
  var clickTAG = clickTag;
</script>
<style>{{inlineCss}}</style>
<body>
  <div id="banner" onclick="window.open(window.clickTag,'_blank')">
    <img id="hero" src="...">
    <div id="content">
      <img id="logo" src="...">
      <h1 id="headline">...</h1>
      <p id="subhead">...</p>
      <span id="cta" class="cta">...</span>
      <small id="legal">...</small>
    </div>
  </div>
</body>
```

Notably missing: `<script>{{inlineGsap}}</script>` and `<script>{{inlineAnimation}}</script>`.

### `styles.css`

Element-level `animation:` properties with staggered delays:

```css
#logo     { animation: bf-fade     0.5s 0.1s both; }
#headline { animation: bf-slide-up 0.6s 0.4s both; }
#subhead  { animation: bf-fade     0.5s 1.0s both; }
#cta      { animation: bf-scale-in 0.5s 1.5s both; }

@keyframes bf-fade     { from { opacity: 0; }                            to { opacity: 1; } }
@keyframes bf-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bf-scale-in { from { opacity: 0; transform: scale(0.92); }      to { opacity: 1; transform: scale(1); } }
```

Total animation: ~2 seconds. For longer spot requirements, the ad network's loop count drives repetition.

## Bundle size

```
HTML skeleton      ~1.0 KB
Inlined CSS        ~0.7 KB  (minified via csso)
Hero image         2–15 KB  (sharp-optimized; smaller than desktop sizes)
Logo               1–3  KB  (svgo-optimized)
Backup PNG         8–20 KB  (palette mode, sharp)
─────────────────────────────────────────────
Typical total     ~15–40 KB per zip
```

Fits comfortably under 50KB.

## Limitations vs. GSAP template

- No scene-by-scene orchestration — staggered delays only.
- No easing curves beyond what CSS provides (`ease`, `ease-in`, `ease-out`, `cubic-bezier`).
- No deterministic final-frame state beyond the animation's natural end.
- No runtime dynamics (e.g., responding to `prefers-reduced-motion`).

These are acceptable trade-offs for mobile-banner slots where the user has <2 seconds of attention anyway.

## What we don't do

- **No CSS containment tricks** (`will-change`, `transform: translateZ(0)`) beyond what the GSAP template uses — CSS-only already has minimal compositing.
- **No `@media (prefers-reduced-motion)`** — ad networks don't test for it and adding the extra rules costs bytes.
- **No animation on the hero image** — it's background. Only content animates.

## Related

- [[GSAP Template]]
- [[Static Template]]
- [[Animation Rules]]
- [[IAB Sizes]]

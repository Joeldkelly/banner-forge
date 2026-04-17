---
tags: [template, gsap, animation]
---

# GSAP Template

**Location:** [`templates/gsap/`](../templates/gsap)
**Files:** `index.html`, `styles.css`, `animation.js`
**Used for:** every IAB size ≥ 50KB ceiling — see [[IAB Sizes]].

## What it is

The default banner template. Produces an animated HTML5 banner using [[#^gsap|GSAP]]'s timeline engine. At build time, the three template files are filled with config values, minified, and concatenated into a single self-contained `index.html`.

^gsap

## Anatomy

### `index.html`

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="ad.size" content="width={{width}},height={{height}}">
<script>
  var clickTag = "{{clickUrl}}";
  var clickTAG = clickTag;
</script>
<style>{{inlineCss}}</style>
</head>
<body>
  <div id="banner" onclick="window.open(window.clickTag,'_blank')">
    <img id="hero" src="{{hero.src}}" alt="{{hero.alt}}">
    <div id="content">
      <img id="logo" src="{{logo.src}}" alt="{{logo.alt}}">
      <h1 id="headline">{{headline}}</h1>
      <p id="subhead">{{subhead}}</p>
      <span id="cta" class="cta">{{cta}}</span>
      <small id="legal">{{legal}}</small>
    </div>
  </div>
  <script>{{inlineGsap}}</script>
  <script>{{inlineAnimation}}</script>
</body>
</html>
```

Meta tag `ad.size` is required by many DSPs for dimension verification.

### `styles.css`

Per-size interpolation via `{{padding}}`, `{{headlineSize}}`, `{{colorPrimary}}`, etc. Comes from the layout heuristics in `scripts/lib/sizes.js`. See [[Build Stage]].

Key rules:
- Flex column content area, centered vertically, left-aligned.
- Absolute-positioned hero behind content.
- `will-change: transform, opacity` on animated elements.
- A 1px `rgba(0,0,0,0.12)` border drawn via `::after` to satisfy DSP boundary requirements.

### `animation.js`

The timeline builder. Reads `window.__BANNER__ = { scenes, loops }` that `build.js` writes immediately before this script runs.

```js
var tl = gsap.timeline({
  repeat: loops - 1,
  defaults: { ease: "power3.out", duration: 0.6 }
});

// hero slow zoom
tl.from("#hero", { scale: 1.06, duration: 0.9, ease: "power2.out" }, 0);

// each scene (intro, headline, subhead, cta) per config.animation.scenes
scenes.forEach((scene, i) => {
  tl.fromTo(`#${scene.id}`, startState(scene.transition), endState(), t);
  t += scene.durationMs / 1000;
});
```

The `onComplete` handler sets every animated element to its end state so the Puppeteer screenshot in [[Render Stage]] is deterministic.

## Transitions

Driven by `scene.transition` in the config:

| Transition  | From                               | To                           |
|-------------|------------------------------------|------------------------------|
| `fade`      | opacity 0                          | opacity 1                    |
| `slide-up`  | opacity 0, translateY(12px)        | opacity 1, translateY(0)     |
| `slide-down`| opacity 0, translateY(-12px)       | opacity 1, translateY(0)     |
| `scale-in`  | opacity 0, scale(0.92)             | opacity 1, scale(1), back-ease |
| `scale-out` | opacity 0, scale(1.08)             | opacity 1, scale(1)          |

Adding a new transition requires one branch in `animation.js` and an optional `@keyframes` addition in `styles.css` for CSS-only parity. See [[Animation Rules]].

## Bundle size budget

```
HTML skeleton     ~1.2 KB
Inlined CSS       ~0.8 KB  (minified via csso)
GSAP core         ~25  KB  (inlined, minified)
Animation.js      ~0.5 KB  (minified via terser)
Hero image        5–80 KB  (sharp-optimized)
Logo              1–5  KB  (svgo-optimized)
Backup PNG        20–40 KB (palette mode, sharp)
────────────────────────────────────────────
Typical total    ~50–150 KB per zip
```

The GSAP bundle alone is ~25KB. That's why any size with a ≤50KB ceiling cannot use this template — see [[CSS-only Template]].

## Ready signal

`window.__BANNER_READY__ = true` is set after the timeline is built. Render.js waits for this flag before starting frame capture.

`window.__BANNER_FINAL__()` is also exposed — calling it jumps the timeline to its final frame. Used as a backup if the deterministic progress-drive approach fails.

## When to not use this template

- **≤50KB sizes** — bundle alone blows the budget. Force-routed to [[CSS-only Template]] by `resolveTemplate()`.
- **Fully static design** — use [[Static Template]].
- **Meta / TikTok / LinkedIn feed** — those platforms refuse HTML5. V1 renders this template to MP4 and ships that.

## Related

- [[CSS-only Template]]
- [[Static Template]]
- [[Animation Rules]]
- [[Build Stage]]
- [[GSAP License Myth]] — important for ad-ops review

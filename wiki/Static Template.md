---
tags: [template, static, meta]
---

# Static Template

**Location:** [`templates/static/`](../templates/static)
**Files:** `index.html`
**Used for:** single-image banners, Meta placements (V1), networks that reject all animation.

## Why it exists

Not every placement accepts animated creative. Use cases:

- **Meta, LinkedIn, TikTok feed** — refuse HTML5 entirely; accept static or video.
- **Retargeting slots** — some retargeting networks require a single JPG or PNG.
- **Conservative advertisers** — regulated industries (healthcare, finance) sometimes require static.
- **Fallback when animation runs out of budget** — a 300×50 at 40KB with no CSS might just be a JPG with a clickable wrapper.

## Anatomy

### `index.html`

```html
<!doctype html>
<html>
<head>
<meta name="ad.size" content="width={{width}},height={{height}}">
<script>
  var clickTag = "{{clickUrl}}";
  var clickTAG = clickTag;
</script>
<style>
  html, body { margin:0; padding:0; width:{{width}}px; height:{{height}}px; overflow:hidden; cursor:pointer; }
  #banner { position:relative; width:{{width}}px; height:{{height}}px; }
  #banner img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  #banner::after { content:""; position:absolute; inset:0; pointer-events:none; border:1px solid rgba(0,0,0,0.12); }
</style>
</head>
<body>
  <div id="banner" onclick="window.open(window.clickTag,'_blank')">
    <img src="{{staticSrc}}" alt="{{ariaLabel}}">
  </div>
</body>
</html>
```

One image. The whole banner is a click surface.

## Bundle size

```
HTML skeleton + inline CSS  ~0.6 KB
Image                       10–80 KB (sharp-optimized)
─────────────────────────────────────
Typical total              ~15–85 KB
```

Typically the lightest of the three templates.

## When the skill picks this template

1. **`config.animation.template === "static"`** — user explicitly wants static output.
2. **Meta / LinkedIn / TikTok network path (V1)** — routes all sizes through this template regardless of config.
3. **Fallback when a size can't fit GSAP or CSS animations in budget** — rare, planned for V2.

## Input

The static template needs a single image:

- **V0.1 MVP:** user supplies `staticSrc` via the hero image path.
- **V1:** rendered automatically by running the GSAP template through [[Render Stage]] and using `backup.png` as the static source.

So the static template can be produced from any GSAP build by effectively renaming `backup.png` to `index` image and wrapping in this template.

## Limitations

- No animation — none. If the designer intends motion and this template gets picked, the motion is lost.
- Single clickTag — no multi-region clicks.
- No responsive logic — fixed dimensions only.

## Delivery paths

| Use              | Ship as               |
|------------------|-----------------------|
| Programmatic     | Zipped HTML (this template) |
| Meta feed        | Raw JPG/PNG, not zipped     |
| TikTok feed      | MP4 (from render stage) or raw JPG |
| LinkedIn sponsored | Raw JPG 1200×627         |

Meta/TikTok/LinkedIn upload paths accept raw images and MP4s directly — no HTML wrapper needed. banner-forge's V1 adds a "deliver raw" mode for these platforms.

## Related

- [[GSAP Template]]
- [[CSS-only Template]]
- [[Render Stage]] — produces the backup PNG that becomes this template's source
- [[Ad Networks]]

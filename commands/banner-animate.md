---
description: Swap or regenerate animation on an existing build. Use when the copy is right but the motion isn't.
argument-hint: <build-dir> [--template gsap|css-only|static]
---

# /banner-animate

Replace the animation on an existing build without re-ingesting or re-rendering the whole pipeline.

## Usage

```
/banner-animate ./build --template gsap
/banner-animate ./build/300x250 --template css-only
```

## What happens

1. Reads `banner.config.json` and overrides `animation.template` with the `--template` argument.
2. Regenerates `index.html`, `animation.js`, and `styles.css` for the target size(s).
3. Re-runs `scripts/render.js` to refresh `backup.png`, `preview.gif`, and `preview.mp4`.
4. Re-packages the affected zips via `scripts/package.js`.
5. Re-validates.

## Template options

- `gsap` — default, GSAP 3.13+ timeline, ~25KB inlined.
- `css-only` — vanilla `@keyframes`, no JS. Required for sizes ≤ 50KB target.
- `static` — single-frame PNG, no animation. Used for networks that require it (Meta, some retargeting placements).

## Scene config

Scenes are defined in `banner.config.json` under `animation.scenes`. Each scene has:

- `id` — label used by the template
- `durationMs` — time on screen
- `transition` — `fade`, `slide-up`, `slide-down`, `scale-in`, `scale-out`

Total animation duration must be ≤ `limits.maxAnimationSeconds` (15s default), with `loops` capped by network (most DSPs: 3 loops max).

See [references/ANIMATION.md](../references/ANIMATION.md).

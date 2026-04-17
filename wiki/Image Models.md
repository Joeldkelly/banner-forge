---
tags: [domain, ai, images, v1]
---

# Image Models

V1 feature. MVP uses user-supplied hero images only. This note describes the planned V1 image-generation architecture.

> [!note]
> Everything on this page is V1 scope. The MVP doesn't call any image model. Users supply `creative.hero.src` as a local file path.

## Recommendation

| Model                                | Use for                                      | License                                           | Default? |
|--------------------------------------|----------------------------------------------|---------------------------------------------------|----------|
| Gemini 2.5 Flash Image (Nano Banana) | Hero variants, brand-consistent iteration    | Commercial API (Google Vertex)                    | **Yes**  |
| FLUX.1 schnell                       | Non-watermarked delivery, offline fallback   | **Apache 2.0** — commercial OK                    | Fallback |
| Imagen 3 / 4                         | High-fidelity product photography            | Commercial API (Google Vertex)                    | Optional |
| gpt-image-1                          | Text-in-image fidelity                       | Commercial API (OpenAI)                           | Optional |
| **FLUX.1 dev**                       | —                                            | **Non-commercial — BLOCKED BY DEFAULT**           | **Never**|
| FLUX.1 pro                           | —                                            | Commercial via Black Forest Labs API only         | No       |

## Why Nano Banana primary

- **Multi-turn reference consistency.** "Same product, different composition" holds across turns. Critical for banner variants at different aspect ratios — you don't want the product to morph when generating 300×600 vs. 728×90.
- **Fast.** Sub-second responses.
- **Cheap** per generation.
- **Commercial API with explicit terms.**

Joel's memory records a specific technique: multi-reference with high strength for faithful product reproduction. Prefer Amazon product photos for reference galleries over lifestyle shots.

## Why FLUX.1 schnell as fallback

- **Apache 2.0.** Deployable offline for agencies that won't send brand assets to third-party APIs.
- **No watermark.**
- **4-step sampling** — fast on consumer hardware.

## Why NOT FLUX.1 dev

FLUX.1 dev is the model referenced in **every tutorial** because it's free to download. It is **non-commercial**. Using it in an ad that runs on a paid network is a license violation.

The MVP config validator will refuse `model: "flux-dev"` entries once V1 lands. This is a trap we're closing proactively.

## Planned V1 config

```json
"ai": {
  "disclosureRequired": true,
  "imageModel": "nano-banana",
  "imageApiKeyEnv": "GEMINI_API_KEY",
  "referenceImages": [
    { "src": "./assets/product-front.jpg", "strength": 0.85 },
    { "src": "./assets/product-side.jpg",  "strength": 0.75 }
  ],
  "prompt": "Spring lifestyle hero, neutral studio background, soft morning light"
}
```

- `imageApiKeyEnv` — environment variable name. Never checked into the repo.
- `referenceImages` — multi-ref for brand consistency. Higher `strength` = more faithful reproduction. Default 0.8.
- `prompt` — Claude helps draft this if the user provides a brief.

## Platform AI disclosure

See [[AI Disclosure]] for the full treatment. Summary:

- **Meta** auto-labels based on C2PA metadata.
- **TikTok** rejects unlabeled realistic AI.
- **YouTube** requires disclosure.
- **Google Ads** requires disclosure for political/sensitive imagery.

**Stripping C2PA metadata is itself a violation.** banner-forge preserves C2PA when present.

## Watermark risk

The Getty Images v. Stability AI UK ruling (November 2025) found **trademark exposure** when a model reproduces Getty watermarks in outputs. banner-forge V2 will include a simple watermark detector (pattern-matching on known watermark glyph positions) and flag risky outputs in the validator.

## Copyright status

US Copyright Office report (January 2025): **purely AI-generated imagery is not copyrightable** in the US without meaningful human authorship.

Users can use AI output. They **cannot prevent competitors from copying** their AI-generated banner image.

Solution: meaningful human authorship = editing, compositing, color-grading, selecting one from many. banner-forge's V1 workflow (generate → designer picks + edits → deliver) clears the bar. A pure "generate and ship" workflow does not.

## Generation flow (V1)

```
banner.config.json (ai.prompt, ai.referenceImages)
         │
         ▼
 scripts/generate-hero.js
         │
         ├─ try Nano Banana
         │     └─ on success: save to assets/hero-ai.jpg with C2PA preserved
         │
         ├─ on failure: try FLUX.1 schnell
         │
         └─ on all-fail: warn and fall through to user-supplied hero
         │
         ▼
  build.js (unchanged — reads assets/hero-ai.jpg)
```

## Related

- [[AI Disclosure]]
- [[Fonts Licensing]] (parallel licensing pattern for fonts)
- [references/IMAGE_MODELS.md](../references/IMAGE_MODELS.md)
- [[Roadmap]] #v1

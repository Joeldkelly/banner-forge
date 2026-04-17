# Image generation models

V1 feature. MVP uses only user-supplied hero images.

## Recommendation

| Model                            | Use for                                      | License / status                                | Default? |
|----------------------------------|----------------------------------------------|-------------------------------------------------|----------|
| Gemini 2.5 Flash Image (Nano Banana) | Hero variants, brand-consistent iteration | Commercial API (Google Vertex)                  | Yes      |
| FLUX.1 schnell                   | Non-watermarked delivery, offline fallback   | **Apache 2.0** — commercial OK                  | Fallback |
| Imagen 3 / 4                     | High-fidelity product photography            | Commercial API (Google Vertex)                  | Optional |
| gpt-image-1                      | Text-in-image fidelity                       | Commercial API (OpenAI)                         | Optional |
| **FLUX.1 dev**                   | —                                            | **Non-commercial — BLOCKED BY DEFAULT**         | Never    |
| **FLUX.1 pro**                   | —                                            | Commercial via Black Forest Labs API only       | No       |

## Why Nano Banana primary

- Multi-turn reference consistency: "same product, different composition" holds across turns. Critical for banner variants at different aspect ratios.
- Fast: sub-second responses, cheap per generation.
- Commercial API with explicit terms.

## Why FLUX.1 schnell fallback

- Apache 2.0. Offline-deployable for agencies that won't send brand assets to third-party APIs.
- No watermark.
- 4-step sampling — fast on consumer hardware.

## Why not FLUX.1 dev

FLUX.1 dev is the model referenced in nearly every tutorial, and it is **non-commercial**. Using it in an ad that runs on a paid network is a license violation. The MVP config validator refuses `model: "flux-dev"` entries.

## Platform AI disclosure

Per platform policies as of 2026:

- **Meta** auto-detects AI content via C2PA metadata in the image. Labels appear on posts automatically.
- **TikTok** rejects unlabeled realistic AI content. Must be labeled at upload.
- **YouTube** requires disclosure for "realistic synthetic media."
- **Google Ads** as of 2024+ requires disclosure for AI-generated political or sensitive imagery.

**Stripping C2PA metadata is itself a policy violation.** banner-forge preserves C2PA when present.

## Getty / watermark risk

The Getty Images v. Stability AI UK ruling (November 2025) found trademark exposure when the model reproduces Getty watermarks in outputs. banner-forge v0.2 will include a simple watermark detector (pattern-matching on known watermark glyph positions) and flag risky outputs in validation.

## Copyright

US Copyright Office report (January 2025): purely AI-generated imagery is not copyrightable in the US without meaningful human authorship. Users cannot prevent a competitor from copying their AI-generated banner image — though they can still use it.

Solution: meaningful human authorship = editing, compositing, color-grading, selecting one from many. The MVP + V1 workflow (generate, designer picks + edits, deliver) clears the bar. A pure "generate and ship" workflow does not.

## API keys (V1)

The V1 config will add an `ai` block:

```json
"ai": {
  "disclosureRequired": true,
  "imageModel": "nano-banana",
  "imageApiKeyEnv": "GEMINI_API_KEY"
}
```

Keys are read from the environment, never checked into the repo.

---
tags: [legal, ai, c2pa]
---

# AI Disclosure

Platform rules, metadata, and copyright status for AI-generated imagery in ads.

## Platform rules (as of 2026)

| Platform    | Rule                                                                                                  |
|-------------|-------------------------------------------------------------------------------------------------------|
| **Meta**    | Auto-detects AI content via C2PA metadata. Applies "AI Info" label to posts with detected AI content. |
| **TikTok**  | **Rejects** unlabeled realistic AI content. Must be labeled at upload or platform rejects submission. |
| **YouTube** | Requires disclosure for "realistic synthetic media" covering people, events, or places.               |
| **Google Ads** | Requires disclosure for AI-generated imagery in political/sensitive categories.                   |

## C2PA metadata

**C2PA** = Coalition for Content Provenance and Authenticity. An open metadata standard that records:

- Whether an image was AI-generated.
- Which model produced it.
- When and where.
- Subsequent edits.

Most 2025+ image generators embed C2PA by default:

- Nano Banana (Gemini 2.5 Flash Image)
- Imagen 3 / 4
- gpt-image-1
- FLUX.1 via Black Forest Labs API

> [!danger]
> **Stripping C2PA metadata is itself a platform policy violation** on Meta and YouTube. Do not use tools that "clean" exported images.

banner-forge's V1 image-generation path will:

1. Receive the image with C2PA embedded.
2. Pass it through sharp **with metadata preservation** (`sharp(..., { attempt: "auto" }).keepMetadata()`).
3. Never strip C2PA.

## FLUX.1 schnell and watermarks

FLUX.1 schnell does not embed C2PA by default (it's the open-source model, not the API version). For commercial use under Apache 2.0, no watermark is added.

**However:** Getty v. Stability AI UK (November 2025) found trademark exposure when a model reproduces Getty-style watermarks in outputs — an artifact of Getty images being in the training data. banner-forge V2 plans a watermark detector to flag outputs that contain visual watermarks (not just C2PA metadata).

## US copyright status

US Copyright Office report, January 2025:

> Purely AI-generated imagery is **not copyrightable** in the United States without meaningful human authorship.

What this means for banner-forge users:

- **They can use** AI-generated banner imagery.
- **They cannot prevent** a competitor from copying the AI-generated image.
- **Meaningful human authorship** = editing, compositing, color-grading, selecting one of many. Our V1 workflow (generate → designer picks + edits → deliver) clears the bar. A pure "click button, ship" workflow does not.

## EU AI Act

The EU AI Act (effective 2025+) adds disclosure obligations:

- Article 50: AI-generated content must be identifiable as such.
- Applies to image, video, and audio.
- Implementation-level: the C2PA metadata chain typically satisfies Article 50 for images.

For EU-served ads, banner-forge's V1 flow (preserve C2PA) is compliant by default. Users who strip C2PA break both platform policy **and** EU law.

## FTC Endorsement Guides

Not AI-specific, but relevant: the FTC's 2023 Endorsement Guides revision clarified that:

- AI-generated user reviews or testimonials are **prohibited**.
- AI-generated images of nonexistent people, places, or products claiming to be real are deceptive.

banner-forge doesn't generate testimonials or realistic photos claiming to be specific people — but users with creative imaging pipelines should know the line.

## banner-forge's position in the README

> **Disclaimer.** This skill generates ad creative using third-party AI models and libraries. The maintainers provide the software AS IS with no warranty. You are responsible for:
>
> - The truthfulness of ad claims.
> - Compliance with platform AI-disclosure requirements (Meta, TikTok, YouTube).
> - IP clearance for brand names, logos, likenesses, fonts, and reference images.
> - Compliance with FTC, state, EU DSA, and EU AI Act rules.
>
> AI-generated imagery is generally not copyrightable in the US without meaningful human authorship. See [references/LEGAL.md](../references/LEGAL.md).

## Validation (V2)

V2 validator checks:

- **C2PA metadata presence** on images in zips referencing AI generation in their sidecar metadata.
- **Visual watermark detection** (simple pattern-matching on Getty-style glyph positions).
- **ALT text sanity** on AI-generated imagery.

MVP validator doesn't check these because MVP doesn't generate images.

## Related

- [[Image Models]] (V1 image generation architecture)
- [[Licensing]]
- [[Trademark]]
- [references/IMAGE_MODELS.md](../references/IMAGE_MODELS.md)
- [references/LEGAL.md](../references/LEGAL.md)

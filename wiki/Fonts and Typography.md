---
tags: [domain, fonts, typography]
---

# Fonts and Typography

What fonts banner-forge allows, what it refuses, and how typography scales across sizes.

## The allowed list

Only fonts with licenses that permit **embedding and redistribution** in ad zips:

- **OFL (SIL Open Font License)** — most Google Fonts families:
  - Inter, Figtree, Manrope, Space Grotesk, DM Sans, Work Sans, Plus Jakarta Sans, Bricolage Grotesque, Lexend
- **Apache 2.0** — Roboto family
- **Ubuntu Font License** — Ubuntu

All distributed via **Fontsource** (an npm-based, redistribution-friendly font registry). banner-forge bundles them; they never call `fonts.googleapis.com` at runtime.

## The refused list

banner-forge **refuses and substitutes**:

| Requested          | Substituted with  | Why refused                                               |
|--------------------|-------------------|-----------------------------------------------------------|
| Helvetica, Helvetica Neue | Inter       | Monotype per-impression tiered fees, not redistributable  |
| Futura             | Figtree           | Bauer Type Foundry, same                                  |
| Avenir             | Manrope           | Linotype/Monotype                                         |
| Gotham             | Figtree           | Hoefler & Co., expensive per-impression                   |
| Proxima Nova       | Plus Jakarta Sans | Mark Simonson, site license doesn't cover ads             |

The substitution is logged as a **warning**, not an error. The pipeline continues.

## Why not hard-error

Designers ask for Helvetica constantly. Hard-failing kills the run. Silent substitution produces wrong-looking output without telling the user. Warning-with-substitution surfaces the issue while keeping the pipeline moving. See [[Decisions Log]].

## Runtime rule: no fonts.googleapis.com

The 2022 LG München ruling found runtime font fetches from Google Fonts constitute a **GDPR violation**. `scripts/validate.js` fails any build whose `index.html` references `fonts.googleapis.com` at runtime.

Self-hosting via Fontsource sidesteps this entirely.

## Per-size typography scale

Set in `scripts/lib/sizes.js:layoutFor()`, indexed by shape:

| Shape                | Headline | Subhead | CTA  |
|----------------------|----------|---------|------|
| billboard (970×250)  | 36pt     | 16pt    | 15pt |
| portrait (300×1050)  | 28pt     | 15pt    | 14pt |
| skyscraper-wide (300×600) | 26pt| 14pt    | 14pt |
| rectangle (300×250)  | 22pt     | 13pt    | 13pt |
| leaderboard-xl (970×90) | 22pt  | 12pt    | 13pt |
| square (250×250)     | 20pt     | 12pt    | 12pt |
| leaderboard (728×90) | 18pt     | 11pt    | 12pt |
| skyscraper (160×600) | 18pt     | 11pt    | 12pt |
| mobile-banner-xl (320×100) | 15pt | 10pt | 11pt |
| skyscraper-narrow (120×600)| 15pt | 10pt | 11pt |
| square-small (200×200) | 15pt   | 10pt    | 11pt |
| mobile-banner (320×50) | 13pt   | **—**   | 11pt |
| banner-legacy (468×60) | 14pt   | **—**   | 11pt |

Mobile banners have `subheadSize: 0` — subheads are dropped entirely to preserve headline + CTA legibility. The template's `{{#if subhead}}` block suppresses the element.

## Font weights

Config shape:

```json
"fonts": {
  "headline": { "family": "Figtree", "weight": 800 },
  "body":     { "family": "Inter",   "weight": 500 }
}
```

Default weights:
- **Headline:** 800 (ExtraBold) — high contrast for small sizes.
- **Body / subhead / CTA:** 500 (Medium) for body; 700 (Bold) is baked into `#cta` regardless of config.

## Font embedding (V1)

MVP **doesn't embed fonts in the zip**. Builds render in whatever font the host system has. Because fonts are typically a "stack" with system-safe fallbacks (`font-family: "Inter", system-ui, -apple-system, sans-serif`), output is close-to-intended on most machines — but not pixel-perfect.

V1 adds font-file packaging:

1. Read `brand.fonts.*.family` from the config.
2. Copy the matching `.woff2` from `assets/fonts/` into `build/<size>/assets/fonts/`.
3. Add a `@font-face` rule to the inlined CSS.

Budget impact: one woff2 subset is typically 20–40 KB. For CSS-only (≤50KB) sizes, font embedding isn't viable; the template falls back to system fonts for those.

## Fallback stack

banner-forge always emits this stack:

```css
font-family: "{{headlineFont}}", system-ui, -apple-system, sans-serif;
```

If the primary fails to load (or isn't embedded), the banner still reads as a clean system-sans.

## Related

- [[Fonts Licensing]] — legal detail
- [[Config Schema]]
- [[Build Stage]]
- [references/LEGAL.md](../references/LEGAL.md)

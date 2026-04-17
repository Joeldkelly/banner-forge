---
tags: [legal, fonts, licensing]
---

# Fonts Licensing

Which fonts banner-forge refuses, why, and what it substitutes.

## Allowed

Licenses that permit **embedding and redistribution** in ad zips:

- **OFL (SIL Open Font License)** — most Google Fonts families
- **Apache 2.0** — Roboto family
- **Ubuntu Font License** — Ubuntu

Distribution via **Fontsource**, an npm-accessible font registry that packages these families for self-hosted use.

### Curated Fontsource families

- Inter, Figtree, Manrope, Space Grotesk, DM Sans, Work Sans, Plus Jakarta Sans, Bricolage Grotesque, Lexend, Roboto, Ubuntu

Banner-forge ships a curated subset (~30-50 families in V1). The curated list is the "safe" default. Users can add other Fontsource families if they bring the license compliance themselves.

## Refused

banner-forge refuses and substitutes:

| Requested                 | License reason                                                                      | Substitute         |
|---------------------------|--------------------------------------------------------------------------------------|--------------------|
| Helvetica, Helvetica Neue | Monotype — per-impression tiered fees. Not commercially redistributable in zips.     | Inter              |
| Futura                    | Bauer Type Foundry — same.                                                           | Figtree            |
| Avenir                    | Linotype / Monotype.                                                                 | Manrope            |
| Gotham                    | Hoefler & Co. — commercial-only, expensive per-impression licensing.                 | Figtree            |
| Proxima Nova              | Mark Simonson — site license doesn't cover ad embedding.                             | Plus Jakarta Sans  |

### Why substitute, not error

Designers ask for these fonts *constantly* because they're visual defaults in the industry. Hard-failing kills the run and produces a bad first impression. Silent substitution produces wrong-looking output without telling the user. **Warning-with-substitution** surfaces the issue while keeping the pipeline moving. See [[Decisions Log]].

### Adobe Fonts specifically

Adobe Fonts (formerly Typekit) **forbids font-file embedding and transfer** — per the Adobe Fonts license agreement. Even if a design team has a Creative Cloud subscription, they cannot ship an Adobe Fonts family inside an ad zip.

Ad agencies frequently miss this. It's the single most common font licensing violation in display advertising.

## The German GDPR rule

> [!warning]
> **Never load fonts from `fonts.googleapis.com` at runtime.**

The 2022 LG München ruling (Germany) found that runtime font fetches from Google Fonts constitute a GDPR violation because:

- Users' IP addresses are transmitted to Google without consent.
- No legitimate interest justifies this transmission when the font could be self-hosted.

Fine ranges from €100 per visitor to €5,000+ for larger cases.

banner-forge's [[Validate Stage]] **fails any zip** whose `index.html` references `fonts.googleapis.com`. Self-hosting via Fontsource sidesteps this entirely.

## Foundry fonts generally

Foundry fonts (Monotype, H&Co, Commercial Type, Klim, Colophon, XYZ Type) trigger **ad-impression tiered licensing** at enterprise cost. Typical terms:

- Per-million-impression fee.
- Minimum annual commitment.
- Usage reporting obligations.

These licenses exist and can be purchased, but they're incompatible with banner-forge's "open-source / free tier" positioning. Users who need Monotype Helvetica need to purchase the license themselves and provide the font files — banner-forge won't ship them.

## Embedding in the zip (V1)

MVP doesn't embed fonts — relies on system fallback. V1 adds:

1. Read `brand.fonts.*.family` from the config.
2. Copy matching `.woff2` from `assets/fonts/` (Fontsource vendored) into `build/<size>/assets/fonts/`.
3. Emit a `@font-face` rule in the inlined CSS.

Budget impact: one `.woff2` subset is typically 20-40 KB. For CSS-only (≤50KB ceiling) sizes, font embedding is not viable — those fall back to system fonts.

## Font subsetting (V1)

To minimize `.woff2` size, subset to just the characters used in the copy. Tools:

- `glyphhanger` or `subset-font` npm packages.
- Runs at build time.
- Typical reduction: 80-95% of full file size.

This is a V1 priority because it makes font embedding viable for many sizes that would otherwise be too large.

## Related

- [[Fonts and Typography]]
- [[Licensing]]
- [[Validate Stage]]
- [references/LEGAL.md](../references/LEGAL.md)

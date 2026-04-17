---
description: Generate a display campaign from a written brief (markdown, text, or PDF). Claude synthesizes brand tokens, copy, sizes, and networks, then runs the full pipeline.
argument-hint: <path-to-brief>
---

# /banner-from-brief

Turn a brief into 15+ network-ready banner zips. No Figma required.

## Usage

```
/banner-from-brief ./brief.md
```

## What happens

1. **Read** — Claude reads the brief file. Accepted formats: `.md`, `.txt`, `.pdf` (V1).

2. **Synthesize** — Claude extracts:
   - Campaign name, advertiser, click URL
   - Brand colors (hex, or named and mapped to Fontsource defaults)
   - Fonts (must resolve to a Fontsource family; Helvetica/Futura are substituted with a warning)
   - Headline, subhead, CTA, legal line
   - Canonical size set (defaults to the MVP 15 unless the brief specifies otherwise)
   - Target networks (defaults to Google + DV360 + TTD + Adform)
   Writes the result to `banner.config.json`.

3. **Confirm** — the skill prints a diff vs. `banner.config.example.json` and asks the user to confirm before continuing.

4. **Pipeline** — runs `scripts/build.js`, `scripts/render.js`, `scripts/package.js`, `scripts/validate.js`.

5. **Report** — summary of sizes, bytes, validation, paths.

## Brief template

A minimal brief that works:

```markdown
# Acme Spring Launch

**Advertiser:** Acme Co.
**Click URL:** https://acme.example.com/spring
**Brand colors:** primary #0A3D2E, accent #F5B700
**Fonts:** Figtree (headline), Inter (body)
**Copy:**
- Headline: Spring savings, sharper than ever.
- Subhead: Up to 30% off the entire line.
- CTA: Shop now
- Legal: Offer ends 5/15.
**Sizes:** default 15
**Networks:** google, dv360, ttd, adform
**Hero:** ./assets/hero.jpg
```

## When to use this vs. `/banner-from-figma`

- **Brief:** no Figma file exists yet, or the campaign is copy-driven with a stock hero.
- **Figma:** the designer has already authored the master frame with real layout and hierarchy.

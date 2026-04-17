---
tags: [legal, trademark, risk]
---

# Trademark

> [!danger]
> **Do not name the project "Open Pencil," "Pencil OSS," "Pencil-Free," or anything pencil-adjacent.** Pencil Learning Technologies holds USPTO serial 88827152 and Brandtech actively uses the mark on trypencil.com.

## Names to avoid

- **Open Pencil, Pencil OSS, Pencil-Free, Pencil-Clone** — all invite cease-and-desist. "Open X" where X is a live commercial mark is a well-trodden legal minefield (OpenAI disputes, OpenTofu vs. Terraform).
- **The free Pencil**, **Pencil, but open source** — direct implications of affiliation.
- **Ad-** prefixes overlapping with Adobe, AdRoll, AdCreative.ai registrations.

## What's permitted — nominative fair use

Under *New Kids on the Block v. News America Publishing*, 9th Cir. 1992:

> Use of another's trademark is permitted if:
> 1. The product or service cannot be readily identified without using the trademark.
> 2. Only so much of the mark as is reasonably necessary to identify the product is used.
> 3. The use does not suggest sponsorship or endorsement.

This means banner-forge **can** say in README and landing page copy:

- "an open-source alternative to Pencil and AdCreative.ai"
- "for teams leaving Pencil's 50-generation monthly cap"
- "comparable to Bannerify and AdCreative.ai"

It **cannot**:

- Use the Pencil logo or trade dress.
- Imply partnership, endorsement, or affiliation.
- Use the marks in ways that suggest official successor or clone status.

### Required alongside nominative use

Include a **"not affiliated"** disclaimer in the README and landing page footer:

> banner-forge is an independent open-source project. It is compared to Pencil (Brandtech Group), AdCreative.ai, Bannerify, and others only for positioning. Those marks belong to their respective owners.

We have this in [README.md](../README.md) and [NOTICE](../NOTICE) already.

## The research findings

- **Pencil** — Pencil Learning Technologies holds USPTO serial 88827152. Brandtech actively uses the mark on trypencil.com.
- **AdCreative.ai** — AdCreative AI OÜ, Estonian company. Registered marks in EU and US.
- **Bannerify** — typically delivered by Bannerify Ltd. Lower-profile but registered.
- **Google Ads, DV360, The Trade Desk, Adform, Amazon DSP** — all household marks. Standard nominative-use applies; don't use logos.

## Logos

Don't include any third-party logos in banner-forge's marketing assets — landing page, GitHub README, YouTube thumbnails. Text references only. Exception: screenshots of the network upload UI may show their logos as incidental content (fair use in editorial contexts).

## If a C&D arrives

Unlikely, but if one does:

1. Read it carefully. Most are form letters that can be resolved by a small edit to copy.
2. **Don't panic-delete the repo.** That damages the project's credibility and doesn't help.
3. Identify the specific claim. Is it:
   - Name conflict (rename)?
   - Logo usage (remove)?
   - Copy implying affiliation (rewrite)?
4. Respond within the C&D's timeframe (usually 14-30 days) with specific changes made.
5. If you disagree, get a lawyer — don't improvise.

Apache 2.0 section 6 disclaims trademark rights on contributors, but doesn't shield against external mark holders. That's on the maintainer.

## The project's own mark

Should Joel trademark "banner-forge"?

- **Not yet.** USPTO filing is ~$250 + attorney fees. Wait until the skill has meaningful market presence.
- **Clearance search** has been done (research doc confirms no USPTO Class 9 / Class 35 conflicts).
- **Domain:** `banner-forge.com` or `bannerforge.dev` could be reserved defensively, but joel.design/banner-forge is the authoritative URL for now.

## Related

- [[Naming and Positioning]]
- [[Licensing]]
- [[Launch Plan]] (for README / landing page copy that respects these rules)
- [references/LEGAL.md](../references/LEGAL.md)

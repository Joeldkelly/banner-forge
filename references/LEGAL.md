# Legal, licensing, and compliance notes

This document does not substitute for legal advice. It records the rules banner-forge enforces and the rationale behind them.

## GSAP license (the important one)

**GSAP 3.13+ is 100% free for commercial use including ads as of April 2025**, following Webflow's October 2024 acquisition of GreenSock.

- The old "Business Green" license tier is **gone**.
- Every previously paid plugin (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother, etc.) is now bundled and free.
- Reference: <https://gsap.com/licensing/>.

banner-forge inlines the free `gsap.min.js` into each GSAP-template build. Ad-ops teams citing the old license are working from stale Stack Overflow posts — link them to the GreenSock licensing page.

## Fonts

banner-forge ships and recommends only fonts with licenses that permit **embedding and redistribution**:

- **OFL (SIL Open Font License)** — most Google Fonts families (Inter, Figtree, Manrope, Space Grotesk, DM Sans, Work Sans, Plus Jakarta Sans, Bricolage Grotesque, Lexend).
- **Apache 2.0** — Roboto family.
- **Ubuntu Font License** — Ubuntu.

banner-forge **refuses** and substitutes:

- **Helvetica, Helvetica Neue** — Monotype license, per-impression tiered fees, not commercially redistributable in ad zips.
- **Futura** — Bauer Type Foundry, same issue.
- **Avenir** — Linotype/Monotype.
- **Gotham** — Hoefler & Co., commercial-only, expensive per-impression licensing.
- **Proxima Nova** — Mark Simonson, site license doesn't cover ad embedding.

Substitutions (visual-match approximation):

- Helvetica → Inter
- Futura → Figtree
- Avenir → Manrope
- Gotham → Figtree
- Proxima Nova → Plus Jakarta Sans

The substitution is logged as a warning. The user can override by adding their own licensed font files to `assets/fonts/` and referencing the family name directly — the validator does not check the family list, only that the font is self-hosted.

## No runtime calls to `fonts.googleapis.com`

The 2022 German court ruling (LG München) found runtime font fetches from Google Fonts constitute a GDPR violation. banner-forge always self-hosts fonts bundled into the zip. `scripts/validate.js` fails any build that references `fonts.googleapis.com` in `index.html`.

## AI-generated imagery disclosure

Users must comply with platform rules:

- Meta: C2PA metadata triggers auto-labeling.
- TikTok: must label realistic AI at upload.
- YouTube: must disclose realistic synthetic media.
- Google Ads: political/sensitive content requires disclosure.

**Stripping C2PA metadata is itself a policy violation** on Meta and YouTube. banner-forge preserves C2PA when present on hero images.

## AI copyright

US Copyright Office report (January 2025): purely AI-generated output is **not copyrightable** in the US without meaningful human authorship. Users can use it; they cannot prevent others from copying it.

banner-forge's workflow (designer selects, edits, composites) clears the bar. A pure "one-click generate and ship" workflow would not.

## Trademark — Pencil / AdCreative.ai / Bannerify

Pencil Learning Technologies holds USPTO serial 88827152 and Brandtech actively uses the mark on trypencil.com.

**Never use in naming:**
- "Open Pencil"
- "Pencil OSS"
- "Pencil-Free"
- "The free Pencil"
- "Pencil, but open source"

**Permitted (nominative fair use), per *New Kids on the Block v. News America Publishing*, 9th Cir. 1992:**
- "an open-source alternative to Pencil" — in the README and landing page only
- "not affiliated with Pencil"

Required alongside nominative use:
- No use of the Pencil logo or trade dress.
- Explicit "not affiliated" disclaimer in the README (see NOTICE file).

Same rules apply to AdCreative.ai, Bannerify, Google Ads, DV360, The Trade Desk, Adform, Amazon DSP, Meta, LinkedIn, TikTok, Figma.

## License for banner-forge itself

Apache 2.0. Rationale:

- Matches Anthropic's own `anthropics/skills` repo convention.
- Includes an **explicit patent grant** (MIT does not) — relevant for patent-heavy ad-tech.
- Defensive termination clause: if someone sues over patent infringement, their license terminates.
- Clean NOTICE file for third-party attributions (sharp, Puppeteer, GSAP, etc.).

## Output liability (banner-forge disclaimer)

banner-forge generates ad creative using third-party AI models and libraries. Users are responsible for:

- Truthfulness of ad claims (FTC, state AGs).
- Platform AI-disclosure compliance (Meta, TikTok, YouTube).
- IP clearance for brand names, logos, likenesses, fonts, reference images.
- EU DSA, EU AI Act, and state-level ad-tech regulations.

Apache 2.0 sections 7 and 8 provide strong warranty/liability disclaimers. The README duplicates them above the fold for reinforcement.

## Known risks to watch

1. **Stale GSAP mythology** in ad-ops review. Address proactively by linking gsap.com/licensing.
2. **Watermark leakage** in FLUX outputs reproducing Getty-style marks (trademark exposure).
3. **C2PA stripping** is its own violation on Meta and YouTube.
4. **Adobe Fonts** feels free to designers but forbids font-file embedding — never ship in a zip.
5. **FLUX.1 dev** is non-commercial despite being the most tutorialized Flux model.
6. **Figma MCP write-back** requires paid Figma seats — the skill degrades to read-only gracefully.
7. **Google's H5 Validator** is deprecated — don't depend on it. Use `@ad-preflight/cli`.
8. **Meta does not accept HTML5.** Users will try and fail. The skill routes correctly via the Meta/LinkedIn/TikTok static + video path (V1).
9. **Lottie from lottiefiles.com** is CORS-rejected by Google Ads. Inline the JSON (V1).
10. **Cowork / Claude Desktop** cannot rely on `brew` — banner-forge bundles `ffmpeg-static`. `gifski` is optional; the pipeline continues without it.

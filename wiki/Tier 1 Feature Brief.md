---
tags: [meta, roadmap, credibility]
source: compass_artifact_wf-70f2af3a-b09d-4c0a-832b-23d19d48580b
received: 2026-04-17
---

# Tier 1 Feature Brief

A second research document arrived after the initial scaffold — a 28-feature tiered brief that reorganizes the roadmap around **industry-insider credibility** rather than breadth of output.

## The thesis

> "`banner-forge` only earns respect if its feature list reads like a field-manual written by someone who has actually been paged at 9pm because a 970×250 failed QA at DV360."

The deepest signal to insiders is not AI. It is **specificity about the stuff that breaks**:

- `clickTag` vs `clickTAG` casing per DSP
- Gzipped vs raw weight (Google Studio measures gzipped; most publishers enforce raw)
- `__MACOSX/` folders from macOS's Finder → Compress
- `ad.size` meta tags (missing this triggers CM360's "missing primary .HTML file" error)
- Quebec Bill 96 French surface-area 2× ratio (fines $3K–$30K per infraction)
- Adform `manifest.json` at zip root
- OMID friendly obstructions (unregistered close buttons tank viewability)

Features that name those things prove the builder has shipped. Features that talk about "AI creative magic" prove they haven't.

## Tier 1 — ships in MVP (highest wow-per-hour)

| # | Feature | Status | Gap |
|---|---|---|---|
| 1 | ClickTag Forge (per-DSP casing + wrappers) | Partial | Missing Studio `Enabler.exit()`, Sizmek `EB.clickthrough()`, Xandr `APPNEXUS.getClickTag()`. Current: dual-global works for Google/DV360/TTD/Adform |
| 2 | LEAN Doctor (gzip-aware linter) | Partial | Missing gzip weights, `__MACOSX`/`.DS_Store`/`Thumbs.db` strip, 0-byte detection, request count, `http://` mixed-content flag |
| 3 | `ad.size` Meta Guard | ✅ In templates | — |
| 4 | Focal Frame (Figma-tagged focal points) | ❌ | Full feature |
| 5 | Master → Children live propagation | ❌ | Full feature |
| 6 | Backup Capture (40KB mozjpeg, dimension-locked) | Partial | Missing target-byte compression loop, hero-frame selection |
| 7 | Figma Variables + Modes (brand/locale) | ❌ | Full feature |
| 8 | Local Preview Harness (per-DSP click simulation) | ❌ | Full feature |
| 9 | Timeline Contract (AST reject `repeat:-1`, prefers-reduced-motion) | Partial | Missing Babel AST, reduced-motion variant, 2s CTA hold |
| 10 | Sizzle Reel MP4 (all sizes in one video) | ❌ | Full feature |

## Tier 2 — ships in V1

- **#11** Localization Matrix (CSV → locale builds, expansion-aware auto-fit)
- **#12** RTL + Quebec Bill 96 validator (French 2× surface area pixel assertion)
- **#13** OMID Friendly Obstructions (auto-register close, AdChoices, branding)
- **#14** Consent Gate (TCF v2.3 mandatory Feb 28 2026, GPP fallback)
- **#15** DCO Batch Mode (feed-driven, deterministic — NOT AI-generated)
- **#16** Timeline Events (GWD-style labels + tap/hover)
- **#17** A11y Triple-Check (WCAG 2.3.1 flash, contrast, color-blind simulation)
- **#18** Preview Wall (shareable URL grid with anonymous comments)
- **#19** Audit Mode (point at any zip → compliance report — **consulting-pipeline gold**)
- **#20** Frame.io + Slack delivery
- **#21** Rive + Lottie embed (≤150KB with state-machine inputs)

## Tier 3 — V2+ aspirational

22. Direct DSP Upload (CM360/DV360/Meta/TikTok APIs)
23. Rising Stars + Expandables (Billboard, Filmstrip, Portrait, Pushdown, Sidekick)
24. Retail Media Pack (Amazon DSP, Walmart Connect, Instacart, Criteo)
25. Vistar DOOH Mode (Dynamic Creative Spec, lat/lon/venue_id)
26. Cartesian A/B Matrix (variant-level metadata for lift analysis)
27. White-Label + Case Study Generator
28. Procedural Behaviors SDK (Cavalry-style data-bound primitives)

## Don't build these (saves real time)

The brief explicitly retires five features that would dilute the signal:

1. **AI-generated copy variations** — saturated by Pencil/AdCreative.ai, reads as slop, legal won't approve without review.
2. **Creative performance prediction / heatmaps / attention scoring** — requires proprietary calibrated data. An OSS generic saliency model is BS any CD will call out.
3. **Full multi-stakeholder approval workflow** — Lytho/Admation/StreamWork own this. Preview Wall (#18) covers 80%.
4. **Auto-winner A/B rotation** — needs tight DSP-side integration, Smartly.io/Marpipe product.
5. **ARIA labels for banner ads** — ads run in sandboxed iframes; screen readers skip. Shadow-boxing. WCAG 2.3.1 flash protection (#17) is where real a11y wins live.

See the [[Decisions Log]] updates dated 2026-04-17.

## The five deepest "tells"

The brief identifies five features that a senior ad ops lead or CD will stop scrolling at:

1. **#1 ClickTag Forge** — DSP casing specificity
2. **#12 RTL + Bill 96** — Quebec surface-area rule
3. **#13 OMID Friendly Obstructions** — nobody outside real ops knows this exists
4. **#14 Consent Gate** — TCF v2.3 date fluency
5. **#17 A11y Triple-Check** — citing the W3C-spec 341×256 reference block

If the README surfaces those five within the first screen, the repo passes the industry-insider credibility test in under ten seconds.

## Positioning shift

**Before (original MVP framing):**
> "One Figma frame. Every banner size. Zero manual exports."

Narrative: replace the resizing day.

**After (Tier 1 stack framing):**
> "The git-native, Figma-first, GSAP-pure alternative to Celtra and Bannerflow — no seats, no export credits, no preview-vs-live surprises."

Narrative: spec-compliant tooling for ad ops, not AI creative magic for marketers.

Both framings coexist. The hero stays as-is (user-benefit); the "What you get" section and feature list reorder to lead with compliance guarantees (insider credibility).

## What this session delivers

See [[Roadmap]] for the updated plan. Short version:

- Code changes: 8 cheap Tier 1 wins pulled forward into v0.1.1
- V1 retires: AI copy matrix, performance heuristics
- README: "What you get" reorders to lead with insider tells

## Related

- [[Roadmap]]
- [[Decisions Log]]
- [[Naming and Positioning]]
- [[clickTag Pattern]]
- [[Ad Networks]]
- [[Validate Stage]]

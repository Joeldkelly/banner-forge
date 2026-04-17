---
tags: [meta, roadmap]
---

# Roadmap

Three releases. MVP ships the hook **and** the industry-insider credibility tells. V1 adds the specialist depth. V2 builds the moat.

> [!note]
> Updated 2026-04-17 to reflect the [[Tier 1 Feature Brief]]. The resizing-day narrative stays; the feature priority now leads with spec-compliance tells (DSP casing, gzip-aware LEAN, `__MACOSX` strip, dimension-locked backups).

## MVP — v0.1 #mvp

**Thesis:** prove the "resizing day replaced" story lands **and** the feature list passes the industry-insider 10-second scan. See [[Tier 1 Feature Brief]] for the credibility criteria.

Scope (complete as of 2026-04-16):

- [x] [[Build Stage]] — config → per-size HTML with GSAP or CSS-only animation
- [x] [[Render Stage]] — Puppeteer screencap → backup PNG + MP4 + GIF
- [x] [[Package Stage]] — per-network zips (Google, DV360, TTD, Adform) with manifest + clickTag
- [x] [[Validate Stage]] — size ceiling, clickTag, external refs, font-source checks
- [x] 15 canonical IAB sizes — see [[IAB Sizes]]
- [x] [[GSAP Template]], [[CSS-only Template]], [[Static Template]]
- [x] Six slash commands — see [[Commands Overview]]
- [x] Reference docs (SIZES, NETWORK_SPECS, CLICKTAG, ANIMATION, IMAGE_MODELS, LEGAL)
- [x] Apache 2.0 license + NOTICE
- [x] Worked example (saas-product-launch)
- [x] GitHub repo public at [github.com/joeldkelly/banner-forge](https://github.com/joeldkelly/banner-forge)

**Tier 1 credibility push (v0.1.1, added 2026-04-17):**

- [x] `__MACOSX` / `.DS_Store` / `Thumbs.db` stripped at zip time (Tier 1 #2)
- [x] Zip-root assertion: `index.html` at depth 0, no nested folders (Tier 1 #2)
- [x] Gzip-aware weight accounting in validate.js (Tier 1 #2)
- [x] 0-byte file detection (Tier 1 #2)
- [x] `http://` mixed-content rejection in validate.js (Tier 1 #2)
- [x] `ad.size` meta tag in templates (Tier 1 #3 — shipped in v0.1.0)
- [x] Per-DSP click-mode profiles (Studio, Sizmek, Xandr) documented + casing validator (Tier 1 #1)
- [x] Target-byte mozjpeg backup with retry loop (Tier 1 #6)
- [x] AST-level rejection of `repeat: -1` in user animation overrides (Tier 1 #9)
- [x] `prefers-reduced-motion` auto-variant (Tier 1 #9)

Remaining MVP tasks:

- [ ] `npm install` + full end-to-end test on a real campaign
- [ ] README hero GIF recorded
- [ ] Claude plugin manifest tested via `claude plugin install`
- [ ] Focal Frame (Tier 1 #4) — deferred to v0.1.2 / V1
- [ ] Master → Children propagation (Tier 1 #5) — deferred to V1
- [ ] Figma Variables + Modes (Tier 1 #7) — deferred to V1
- [ ] Local Preview Harness (Tier 1 #8) — deferred to V1
- [ ] Sizzle Reel MP4 generator (Tier 1 #10) — deferred to v0.1.2

Launch prerequisites beyond v0.1:

- Landing page at joel.design/banner-forge — see [[Landing Page]]
- Preview-DM briefs for Tier 1 [[Amplifiers]]
- Eight awesome-list PRs drafted

## V1 — v0.2 #v1

**Thesis:** turn first wave of users into agencies. Lead with consulting-gold features (Audit Mode, Preview Wall) and specialist-depth signals (Bill 96, OMID, TCF v2.3, WCAG 2.3.1).

**Core pipeline additions:**

- [ ] Figma MCP ingest — real extraction of tokens, copy, hero images
- [ ] Figma Variables + Modes ingestion (Tier 1 #7) — brand/locale modes
- [ ] Figma write-back (paid-seat) — push generated variants back
- [ ] Focal Frame with `@focal` tagged layers + per-size priority manifest (Tier 1 #4)
- [ ] Master → Children live propagation via `chokidar` (Tier 1 #5)
- [ ] Local Preview Harness with per-DSP click simulation (Tier 1 #8)
- [ ] Sizzle Reel MP4 generator (Tier 1 #10)

**Specialist features from the Tier 1 Feature Brief (Tier 2 items):**

- [ ] Localization Matrix (#11) — CSV-driven swaps, expansion-aware auto-fit
- [ ] RTL + Quebec Bill 96 validator (#12) — French 2× surface-area pixel assertion
- [ ] OMID Friendly Obstructions (#13) — auto-register close/adchoices/branding
- [ ] Consent Gate (#14) — TCF v2.3 (mandatory Feb 28, 2026) + GPP fallback
- [ ] DCO Batch Mode (#15) — feed-driven, deterministic, NO AI
- [ ] Timeline Events (#16) — GWD-style labels + tap/hover triggers
- [ ] A11y Triple-Check (#17) — WCAG 2.3.1 flash, contrast, color-blind simulation
- [ ] Preview Wall (#18) — shareable URL, anonymous comments per size
- [ ] **Audit Mode (#19) — point at any zip, get compliance report. Consulting-pipeline gold.**
- [ ] Frame.io + Slack delivery (#20) — build-complete webhooks
- [ ] Rive + Lottie embed (#21) — ≤150KB with state-machine inputs

**Social / platform delivery:**

- [ ] Meta / LinkedIn / TikTok static + video paths (1:1, 4:5, 9:16 at 1080p)
- [ ] Amazon DSP package path with 2x retina for 320×50 and 414×125
- [ ] Trafficking spec sheet PDF

**Image generation (scoped narrower than original plan):**

- [ ] Nano Banana (Gemini 2.5 Flash Image) hero variants
- [ ] FLUX.1 schnell fallback

**Removed from V1 (see [[Decisions Log]] 2026-04-17):**

- ~~Copy variation matrix (N headlines × M CTAs)~~ — saturated, reads as slop
- ~~Competitive ad research via Firecrawl/Apify~~ — moved to V2 as research-only, not core

## V2 — v0.3+ #v2

**Thesis:** build the moat Pencil never built for SMB. Move from portfolio piece to maintained tooling.

- [ ] Brand-book ingestion (PDF or markdown) with persistent tokens across runs
- [ ] Direct DSP Upload (#22) — CM360/DV360/Meta/TikTok/LinkedIn via native APIs
- [ ] Rising Stars + Expandables (#23) — Billboard, Filmstrip, Portrait, Pushdown, Sidekick
- [ ] Retail Media Pack (#24) — Amazon DSP, Walmart Connect, Instacart, Criteo presets
- [ ] Vistar DOOH Mode (#25) — Dynamic Creative Spec with lat/lon/venue_id binding
- [ ] Cartesian A/B Matrix (#26) — variant-level metadata for lift analysis
- [ ] White-Label + Case Study Generator (#27) — agency-branded exports
- [ ] Procedural Behaviors SDK (#28) — Cavalry-style data-bound primitives
- [ ] Video ad generation via Kling 3.0 / Veo 3.1
- [ ] Cowork / Claude Desktop parity checks
- [ ] Anthropic plugin marketplace verified badge
- [ ] Additional animation templates — Motion One, Framer Motion for React apps

**Removed from V2 (see [[Decisions Log]] 2026-04-17):**

- ~~Performance heuristics overlay~~ — requires proprietary calibrated data; reads as BS in portfolio review
- ~~ARIA / screen-reader support~~ — shadow-boxing; ads run in sandboxed iframes

## Milestones (30/60/90)

### Days 1–30: Build and validate MVP

- Week 1 — scaffold, SKILL.md, commands, plugin manifest ✅
- Week 2 — one 300×250 end-to-end from Figma URL to validated zip
- Week 3 — expand to 15 sizes, dual clickTag, Adform manifest
- Week 4 — run a real campaign with a willing former colleague (ex-Dyson source)

### Days 31–60: Launch and amplification

See [[Launch Plan]].

- Week 5 — landing page live, awesome-list PRs submitted, Tier 1 preview DMs
- Week 6 — Show HN Tuesday 8:30am PT, X thread, community drops
- Week 7 — YouTube long-form
- Week 8 — Product Hunt (hunted by Meng To or Pietro Schirano), Anthropic plugin directory

### Days 61–90: V1 release and consulting pipeline

- Week 9-10 — ship V1 features
- Week 11 — flagship blog post: "I replaced my $240/year Figma plugin with a 300-line Claude skill"
- Week 12 — codify consulting offer, ship a complementary skill (`figma-to-email` or `campaign-qa`)

## Kill criteria

If by Day 60 the skill has <100 GitHub stars, <10 tracked installs, and zero consulting discovery calls, revisit positioning. Pencil-comparison angle may not be working; try a vertical-specific variant (e.g., retail-only, SaaS-launch-only).

## Related

- [[Project Overview]]
- [[Launch Plan]]
- [[Decisions Log]]

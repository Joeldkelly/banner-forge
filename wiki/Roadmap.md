---
tags: [meta, roadmap]
---

# Roadmap

Three releases. MVP ships the hook. V1 adds the richness. V2 builds the moat.

## MVP — v0.1 #mvp

**Thesis:** prove the "resizing day replaced" story lands.

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
- [ ] `npm install` + full end-to-end test on a real campaign
- [ ] GitHub repo created and pushed
- [ ] README hero GIF recorded
- [ ] Claude plugin manifest tested via `claude plugin install`

Launch prerequisites beyond v0.1:

- Landing page at joel.design/banner-forge — see [[Landing Page]]
- Preview-DM briefs for Tier 1 [[Amplifiers]]
- Eight awesome-list PRs drafted

## V1 — v0.2 #v1

**Thesis:** turn first wave of users into agencies.

- [ ] Figma MCP ingest — real extraction of tokens, copy, hero images from a frame URL
- [ ] Figma write-back (paid-seat) — push generated variants back into the source file
- [ ] Nano Banana (Gemini 2.5 Flash Image) hero generation — see [[Image Models]]
- [ ] FLUX.1 schnell fallback for non-watermarked delivery
- [ ] Copy variation matrix — N headlines × M CTAs, A/B friendly naming
- [ ] Meta / LinkedIn / TikTok static + video paths (1:1, 4:5, 9:16 at 1080p)
- [ ] Lottie template with inlined JSON (CORS-safe for Google Ads)
- [ ] Amazon DSP package path with 2x retina for 320×50 and 414×125
- [ ] Trafficking spec sheet PDF — one page per campaign, every asset catalogued
- [ ] Competitive ad research via Firecrawl MCP + Apify Meta Ad Library scraper

## V2 — v0.3+ #v2

**Thesis:** build the moat Pencil never built for SMB.

- [ ] Brand-book ingestion (PDF or markdown) with persistent tokens across runs
- [ ] DCO-lite feed automation — CSV of product rows → N personalized banners per row
- [ ] Performance heuristics overlay — CTA placement, contrast, text density, brand adherence
- [ ] Video ad generation via Kling 3.0 (fal.ai) default; Veo 3.1 for premium
- [ ] Cowork / Claude Desktop parity — identical behavior hosted vs. local
- [ ] Anthropic plugin marketplace submission (verified badge)
- [ ] Additional size packs — OOH, CTV companions, retail media
- [ ] Additional networks — Criteo, Xandr
- [ ] Additional animation templates — Motion One, Framer Motion for React apps

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

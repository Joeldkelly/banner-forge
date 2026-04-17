---
tags: [launch, plan]
---

# Launch Plan

Week-by-week sequence. Built around the rule: **one HN Show HN, one PH day, one Twitter thread, sequenced two to three weeks apart, not simultaneous.** Each wave needs a fresh audience and room to improve between shots.

## Timing rules

- **HN optimal windows:** Tuesday or Wednesday 8:30am Pacific, or Saturday/Sunday noon Pacific.
- **PH day:** 2–3 weeks *after* the HN drop.
- **Tier 1 amplifier DMs:** 5 days before public launch.
- **Tier 3 newsletter submissions:** 7 days before public launch.
- **Awesome-list PRs:** submit all 8 in parallel within 48 hours of the public repo going live.

## Week 1–4 — Build and validate MVP

Status: Week 1–2 delivered. Remaining work tracked in [[Roadmap]] #mvp.

- Week 1 — Scaffold, SKILL.md, six slash commands, plugin manifest. **Done.**
- Week 2 — GSAP template + Puppeteer pipeline + dual clickTag + Adform manifest. **Mostly done; needs real-run test.**
- Week 3 — Expand to 15 sizes, file-size optimization pass, validation stage. **Done (pending end-to-end test).**
- Week 4 — Real campaign with a willing ex-Dyson colleague. Capture demo video during this run. Fix rough edges. Write worked example.

## Week 5 — Soft launch prep

- [ ] Publish [[Landing Page|landing page]] at joel.design/banner-forge.
- [ ] Submit 8 awesome-list PRs — see [[Amplifiers]] for full list.
- [ ] Send preview DMs to Tier 1 amplifiers (5 days ahead of public launch):
  - [[Amplifiers|Pietro Schirano, Greg Isenberg, Jesse Vincent, AI Jason, Cole Medin, IndyDevDan, Matthew Berman, Riley Brown]]
  - Personalized invite + private preview video.
  - Ask for nothing. If they retweet, they retweet.

## Week 6 — Public launch day (Tuesday)

- [ ] **Tuesday 8:30am Pacific** — Show HN post:
  > `Show HN: banner-forge – generate every IAB banner size from one Figma frame using a Claude skill`
- [ ] **Same morning** — X thread (9-tweet, one per pipeline beat).
- [ ] **Same day** — drops in:
  - Friends of Figma Discord #show-and-tell and #plugins
  - Designer Hangout Slack #tools and #ai
  - Design Buddies Discord (early adopters)
  - Bluesky design community (tag Brad Frost, Jason Santa Maria)
  - r/ClaudeAI, r/LocalLLaMA
  - Indie Hackers launch post
- [ ] **First 12 hours** — answer every HN comment within 2 hours.

### 7 days before launch — newsletter pipeline

- [ ] Sidebar.io
- [ ] Dense Discovery (Kai Brach)
- [ ] UX Collective (Fabricio Teixeira)
- [ ] Smashing Magazine (long-form pitch: "how I built")
- [ ] TLDR AI
- [ ] Ben's Bites
- [ ] The Rundown AI
- [ ] Creator Economy by Peter Yang

## Week 7 — YouTube + LinkedIn follow-through

- [ ] YouTube long-form goes live (8–11 min, structured problem/demo/SKILL.md tour/customize/CTA).
- [ ] LinkedIn post angled at **ROI** ("6 hours per campaign to under a minute"), not craft.
- [ ] Pitch Meng To, Gary Simon, Jesse Showalter for a feature or co-demo.
- [ ] Engage every inbound DM that mentions a real use case.

## Week 8 — Product Hunt

- [ ] Ask Meng To or Pietro Schirano to hunt (2–3 weeks *after* HN).
- [ ] Submit to Anthropic's plugin directory for the verified badge.
- [ ] Start collecting first 10 testimonials; target 2 case studies.

## Week 9–12 — V1 + consulting codification

- Week 9–10 — Ship V1 features: Nano Banana image gen, copy variation matrix, Meta/LinkedIn/TikTok static + video. Release v0.2.0 with changelog-driven X thread.
- Week 11 — Flagship blog post: *"I replaced my $240/year Figma banner plugin with a 300-line Claude skill."* Pitch to Smashing Magazine as guest post. Second YouTube: *"50 IAB banner sizes in 60 seconds with Claude Code."*
- Week 12 — Codify consulting offer (package: "custom internal Claude skill for your agency"). Ship complementary skill (`figma-to-email` or `campaign-qa`) to capitalize on momentum. Submit lightning-talk proposal to Config 2026.

## Assets to produce before launch

- [ ] **Hero GIF** for README — 15–25s, autoplay loop, before-and-after. Screen Studio → ezgif 3-color palette.
- [ ] **Primary launch video** — 45–60s, muted-friendly, 9:16 or 1:1, text overlay. Opens on manual export pain, cuts to skill invocation, ends on folder full of banners.
- [ ] **YouTube long-form** — 8–11 min.
- [ ] **Landing page** at joel.design/banner-forge with hero video loop, install command, three use cases, consulting Calendly.
- [ ] **Show HN title** — `Show HN: banner-forge – generate every IAB banner size from one Figma frame using a Claude skill`
- [ ] **9-tweet thread** — one tweet per pipeline beat.
- [ ] **LinkedIn post** — ROI-angled, not craft-angled.

## Kill criteria

If by Day 60 the repo has fewer than 100 stars, no tracked plugin installs, and zero consulting discovery calls:

- Re-evaluate the positioning. Try a vertical-specific variant (retail-only, SaaS-launch-only).
- Consider whether the "resizing day replaced" story actually lands with the market, or whether Pencil-comparison framing would work better.
- The research blueprint acknowledges a 6-month window before a funded team ships adjacent — if the window closes without traction, pivot to V2 moat features faster.

## Related

- [[Amplifiers]] — who to DM, where to post
- [[Landing Page]] — site spec
- [[Consulting Funnel]] — the real product under the skill
- [[Naming and Positioning]]
- [[Roadmap]]

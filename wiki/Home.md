---
tags: [moc, home]
aliases: [Start, Index, MOC]
---

# banner-forge wiki

> One Figma frame. Every banner size. Zero manual exports.

The living documentation for banner-forge — a Claude Code skill that turns one brand config into 60 production-ready banner ads across every major ad network.

**New to the project? Start here:** [[Project Overview]] · [[Glossary]] · [[Pipeline Overview]]

---

## Map of content

### Start

- [[Project Overview]] — what this is, in plain language
- [[Glossary]] — every piece of jargon defined
- [[Roadmap]] — MVP → V1 → V2 plan
- [[Decisions Log]] — why we picked what we picked

### Architecture

- [[Pipeline Overview]] — the four-stage flow
- [[File Structure]] — what lives where in the repo
- [[Config Schema]] — anatomy of `banner.config.json`
- [[Why One Skill Not Many]] — the mega-skill design choice

### Pipeline stages

- [[Build Stage]] — config → per-size HTML
- [[Render Stage]] — Puppeteer → PNG + GIF + MP4
- [[Package Stage]] — HTML → per-network zip
- [[Validate Stage]] — compliance report

### Templates

- [[GSAP Template]] — the default animated banner
- [[CSS-only Template]] — the mobile / tiny-size fallback
- [[Static Template]] — single-image zip for Meta etc.

### Domain knowledge

- [[IAB Sizes]] — the 15 canonical sizes and why
- [[Ad Networks]] — Google, DV360, TTD, Adform, Amazon
- [[clickTag Pattern]] — the dual-global trick
- [[Animation Rules]] — GSAP vs CSS vs Lottie vs MP4
- [[Image Models]] — Nano Banana, FLUX, Imagen (V1)
- [[Fonts and Typography]] — what's allowed, what's not

### Commands

- [[Commands Overview]] — the six user-facing slash commands

### Launch

- [[Naming and Positioning]] — banner-forge, "replace the resizing day"
- [[Launch Plan]] — week-by-week, Tuesday 8:30am PT
- [[Amplifiers]] — who to DM, in what order
- [[Landing Page]] — joel.design/banner-forge spec
- [[Consulting Funnel]] — the real business under the skill

### Legal and risk

- [[Licensing]] — Apache 2.0 and why
- [[GSAP License Myth]] — the stale blocker that isn't blocking anymore
- [[Trademark]] — nominative fair use, names to avoid
- [[Fonts Licensing]] — substitutions and refusals
- [[AI Disclosure]] — C2PA, platform rules, copyright

### People

- [[Joel Kelly]]
- [[Amplifiers]]

---

## Status

- **Version:** v0.1.0 scaffold (pre-launch)
- **Last reviewed:** 2026-04-16
- **Repo:** `github.com/bettaspld/banner-forge` *(not yet public)*

## Conventions

- Code-adjacent docs live in [SKILL.md](../SKILL.md) and [references/](../references/). This wiki links to them and adds context (the *why*, the market angle, the history).
- Use `[[wikilinks]]` for notes. Use regular markdown links for code/references outside the vault.
- Tags: `#mvp`, `#v1`, `#v2`, `#architecture`, `#domain`, `#legal`, `#launch`, `#risk`.

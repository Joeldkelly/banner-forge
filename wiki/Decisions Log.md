---
tags: [meta, decisions, adr]
---

# Decisions Log

Append-only. New decisions go at the top. Each entry: date, decision, alternatives considered, rationale.

---

## 2026-04-16 — Apache 2.0 license

**Decision:** Apache 2.0 for banner-forge itself.

**Alternatives:** MIT, BSD-3, GPL-3.

**Rationale:**
- Matches Anthropic's own `anthropics/skills` repo.
- Explicit patent grant — relevant for patent-heavy ad-tech.
- Defensive termination clause.
- Clean NOTICE file for third-party attributions.
- GPL would block agency adoption.

See [[Licensing]].

---

## 2026-04-16 — Single mega-skill, not federated

**Decision:** one skill with file-based pipeline, not multiple skills.

**Alternatives:** split into `banner-build`, `banner-render`, `banner-validate` sub-skills.

**Rationale:**
- Every successful complex Claude skill as of late 2025 converges on one orchestrator + progressive-disclosure references + deterministic scripts.
- Federated skills burn metadata tokens, fragment install instructions, and split the GitHub-star economy.
- Only split when a sub-component becomes independently useful.

See [[Why One Skill Not Many]].

---

## 2026-04-16 — Config-first, Figma-optional

**Decision:** the MVP's primary input is `banner.config.json`. Figma ingest is a V1 feature that writes to the same config schema.

**Alternatives:** Figma-first with config as fallback.

**Rationale:**
- Testing doesn't require a Figma file.
- Decouples the pipeline from Figma MCP availability (free-seat vs. paid-seat gating).
- One input format, multiple source modes — cleaner architecture.

---

## 2026-04-16 — Node runtime, not Python

**Decision:** all pipeline scripts in Node.js ≥20, ES modules.

**Alternatives:** Python, mixed Node/Python.

**Rationale:**
- Every meaningful library in the display-ad stack is Node-first (Puppeteer, GSAP, sharp, archiver, terser, csso, svgo).
- Single-runtime keeps install simple and bash invocations consistent.

---

## 2026-04-16 — Puppeteer, not Playwright

**Decision:** Puppeteer for headless rendering.

**Alternatives:** Playwright.

**Rationale:**
- Native `page.screencast()` with built-in MP4 encoding (since Chrome 120).
- Chromium-only is fine for ads; cross-browser isn't a requirement.
- Lighter dep footprint than Playwright.

---

## 2026-04-16 — GSAP inlined, not CDN-loaded

**Decision:** bundle GSAP into each generated HTML file.

**Alternatives:** `<script src="https://cdn.jsdelivr.net/gsap/...">`

**Rationale:**
- Every ad network forbids external scripts beyond measurement pixels.
- Eliminates CDN-availability risk.
- Free-for-ads as of April 2025 means no licensing issue with bundling. See [[GSAP License Myth]].

---

## 2026-04-16 — Dual clickTag globals

**Decision:** declare both `clickTag` (lowercase) and `clickTAG` (uppercase) in every build.

**Alternatives:** lowercase only.

**Rationale:**
- Google / DV360 use lowercase.
- TTD and Adform's legacy adapters read uppercase.
- One zip passes all four networks.
- Cost: 30 bytes.

See [[clickTag Pattern]].

---

## 2026-04-16 — No multi-file polite-load in MVP

**Decision:** inline everything into `index.html` for MVP. V1 introduces a two-file polite-load pattern.

**Alternatives:** ship `index.html` + `polite.js` from day one.

**Rationale:**
- Single-file is simpler for first-run testing.
- Networks' initial-load ceiling is 150KB; we fit comfortably for most sizes with GSAP inlined + small hero.
- When we hit sizes that don't fit (large hero for 970×250), V1 will add the two-file path.

---

## 2026-04-16 — Refuse Helvetica/Futura; substitute and warn

**Decision:** if the config requests Helvetica, Futura, Gotham, Avenir, or Proxima Nova, substitute with Inter/Figtree/Manrope and log a warning. Don't error.

**Alternatives:** hard error; or silently substitute.

**Rationale:**
- Designers ask for these constantly; erroring kills the run.
- Silent substitution would produce wrong-looking output without the user knowing.
- Warning-with-substitution surfaces the issue while keeping the pipeline moving.

See [[Fonts Licensing]].

---

## 2026-04-16 — ffmpeg-static, not system ffmpeg

**Decision:** bundle `ffmpeg-static` as a dependency.

**Alternatives:** assume system `ffmpeg` via `brew install ffmpeg`.

**Rationale:**
- Cowork and Claude Desktop environments have no `brew`.
- Bundled binary means the skill works identically everywhere.
- ~40MB install cost is acceptable.

---

## 2026-04-16 — gifski as optionalDependency

**Decision:** `gifski` in `optionalDependencies`. Pipeline continues without it, skipping GIF.

**Alternatives:** hard dependency; or vendored binary.

**Rationale:**
- gifski's AGPL license for the binary is awkward for a dependency chain.
- Most users don't need a GIF preview — MP4 is sufficient.
- Skipping with a warning keeps the pipeline on rails.

---

## 2026-04-16 — Minimal in-house zip reader in validate.js

**Decision:** parse zip central directory inline in `scripts/validate.js` rather than adding `adm-zip` or `yauzl`.

**Alternatives:** npm dependency for zip reading.

**Rationale:**
- We only need to find `index.html`, decompress it, and list entries — no write path.
- Avoids a dep just for validation.
- ~80 lines of code, well-commented.

---

## 2026-04-16 — Project name: banner-forge

**Decision:** `banner-forge` over `adloom`, `bannerwright`, `multiply`, `impression`.

**Alternatives:** see [[Naming and Positioning]].

**Rationale:**
- Descriptive, hyphen-safe for SKILL.md regex.
- No conflicting USPTO marks in software class 9 or advertising class 35.
- `-forge` suffix reads as "builder tool" to a technical audience.
- Backup: `adloom` if `banner-forge` taken on a surface that matters.

---

## 2026-04-16 — Personal brand, not separate brand

**Decision:** bundle under joel.design. Repo at `github.com/bettaspld/banner-forge`.

**Alternatives:** stand up a dedicated product brand.

**Rationale:**
- Freelance consulting buyers search for people, not tools (see Pieter Levels playbook).
- Every GitHub star compounds joel.design search equity.
- Separate brand only makes sense with a team and funding.

See [[Consulting Funnel]].

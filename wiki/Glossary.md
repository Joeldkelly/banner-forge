---
tags: [meta, glossary]
---

# Glossary

Plain-English definitions for every term in this project.

## Core terms

**banner ad** — An image, animation, or small HTML5 page that shows up alongside content on a website to promote something. Sized in pixels (e.g. 300×250).

**banner-forge** — This project. A Claude Code skill that takes one brand config (colors, copy, logo) and produces banner ads in every standard size, ready to upload to ad networks.

**Claude Code skill** — A plug-in for Claude Code. A folder of markdown + scripts. Claude reads the `SKILL.md` and follows the recipe. Installed via `claude plugin install` or cloned directly.

**MCP (Model Context Protocol)** — The wire that lets Claude talk to outside tools (Figma, Slack, Gmail). When the skill reads a Figma file, it does so through the Figma MCP server, not a direct API call.

## Ad-industry jargon

**IAB** — Interactive Advertising Bureau. The industry body that standardized banner dimensions. "IAB sizes" = the 15ish standard rectangles that every network accepts.

**clickTag** — A JavaScript variable in the banner that holds the click-through URL. The ad network overrides it at serve time with a tracked URL. Without this, clicks go nowhere measurable.

**polite load** — An ad-loading pattern where the initial HTML is tiny (≤150KB), and heavy assets are loaded *after* the host page finishes loading. Google and most DSPs require it.

**DSP (Demand-Side Platform)** — The ad network that decides in real-time which ad to serve. DV360, The Trade Desk, Adform are DSPs. The zip we deliver is what the DSP hands out.

**ad network** — Generic term for the place ads get uploaded and served. Google Ads, DV360, TTD, Adform, Amazon DSP.

**backup image** — A static PNG version of the banner. Required by every ad network as a fallback when the browser can't render HTML5. banner-forge generates it automatically as the final frame of the animation.

**manifest.json** — A small JSON file some networks (Adform specifically) require inside the zip to declare the banner's dimensions and clickTag variable.

**trafficking / traffic team** — The people at an agency who upload the finished zip to the ad network and configure the campaign. They're the ones who will reject a zip with a broken clickTag.

**programmatic display** — The whole ecosystem of automated banner-ad buying. "Programmatic inventory" = all the banner slots across the web that DSPs bid on in real time.

**polite retargeting** — When an ad shows you a product you already looked at. Not a technical term here, just context.

## Technical terms

**GSAP (GreenSock Animation Platform)** — The industry-standard JavaScript animation library. ~25KB gzipped. **Free for all commercial use including ads as of April 2025.** See [[GSAP License Myth]].

**Puppeteer** — A Node.js library that controls a headless Chrome browser. banner-forge uses it to open the finished HTML and screenshot it for the backup image, and record it as video.

**headless browser** — A browser with no visible window. Runs invisibly in the background. Used for automated screenshots, testing, and PDF generation.

**Fontsource** — An open package registry of web fonts licensed for redistribution (OFL, Apache, Ubuntu Font License). banner-forge bundles fonts from here to avoid runtime calls to Google Fonts.

**C2PA** — Coalition for Content Provenance and Authenticity. A metadata standard that records whether an image was AI-generated. Meta and YouTube auto-label AI content based on this. Stripping it is a policy violation.

**Nano Banana** — Informal name for Google's Gemini 2.5 Flash Image model. Best-in-class at keeping a product consistent across multiple generations. banner-forge's V1 default for image generation.

**FLUX.1** — An open-source image generation model family by Black Forest Labs.
  - **schnell** — Apache 2.0, commercial OK. banner-forge's fallback.
  - **dev** — Non-commercial. Never ship it in an ad.
  - **pro** — Commercial API only via BFL.

**Lottie** — A format for vector animations (usually exported from After Effects). Plays via JavaScript in the browser. **Do not load Lottie JSON from lottiefiles.com** — Google Ads CORS-rejects it. Inline the JSON.

## This project's shape

**MVP** — v0.1, the scaffold we just built. Config → 15 IAB sizes → Google/DV360/TTD/Adform zips. See [[Roadmap]].

**V1** — v0.2. Adds Figma auto-ingest, Nano Banana images, copy variation matrix, Meta/LinkedIn/TikTok static + video, Amazon DSP.

**V2** — v0.3+. Brand-book ingestion, DCO-lite, performance heuristics, video generation (Kling/Veo).

**the resizing day** — The narrative anchor. The 6–40 hours designers lose every campaign to manual resizing. The thing banner-forge kills. See [[Naming and Positioning]].

**the consulting funnel** — The actual business. The skill is free and open source; it drives traffic to joel.design, where Joel books paid engagements building custom Claude skills for agencies. See [[Consulting Funnel]].

## People and places

**Pencil** — A commercial ad-generation SaaS (Brandtech Group). The competitor banner-forge quietly flanks from below (SMB / mid-market) without naming as the enemy. See [[Trademark]].

**Pietro Schirano (@skirano)** — The single highest-leverage Twitter amplifier for Claude skills. Ex-Anthropic. See [[Amplifiers]].

**joel.design** — Joel's personal brand and consulting site. banner-forge lives under this brand, not as a standalone product.

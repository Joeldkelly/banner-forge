---
tags: [launch, landing, web]
---

# Landing Page

Spec for joel.design/banner-forge. Single page, single flow, one primary CTA.

## URL

`joel.design/banner-forge`

Also: `skills.joel.design/banner-forge` reserved for future skill portfolio, but primary is the `/banner-forge` slug under the main domain for SEO equity.

## Hero section

- **Hero visual:** auto-looping 20-second MP4 (the same asset becomes the README hero GIF). Before-and-after: a Figma frame → folder of rendered banners.
- **Tagline:** "One Figma frame. Every banner size. Zero manual exports."
- **Primary CTA:** button to the GitHub repo.
- **Secondary CTA:** "Book consulting call" (Calendly).

No email capture on the hero. Keep friction low for the first click (to GitHub).

## Three-column value prop

| 40+ sizes in under a minute       | Every network pre-validated                  | Free and open source                    |
|-----------------------------------|-----------------------------------------------|------------------------------------------|
| The canonical size list           | Google / DV360 / TTD / Adform / Amazon logos  | Apache 2.0 badge, GitHub stars badge    |

## How it works (four-step diagram)

```
1. Figma frame   →   2. Claude invokes skill   →   3. 40+ sizes generated   →   4. Zips land in ./build/
```

Optional subtext under each step (one line each):

1. Or start with a brief.md, no Figma needed.
2. Live animation of the terminal `/banner-from-figma <url>` typing in.
3. 15 IAB + 9 platform-native sizes, rendered in parallel.
4. Uploadable to any DSP. Validation report included.

## Live example

Embedded before-and-after:
- A real client brief (text).
- The Figma master (screenshot).
- The folder of deliverables (grid of 60 banner thumbnails).

Ideal source: the Dyson ex-team campaign (Week 4 MVP validation run).

## Customer proof (fill post-launch)

Quotes from the first 10 users. Ideal mix:

- One agency creative director.
- One in-house marketing lead.
- One freelance designer.
- One "we automated three days of work" ROI quote.

Avoid quotes like "so cool." Prefer quotes that name the old pain and the new outcome.

## Author section

> Built by Joel Kelly, senior digital designer. 15 years shipping banner campaigns at corporate shops. Most recently, Dyson's North America digital designer. I help agencies and in-house teams build custom Claude skills for their creative workflows.

Photo, LinkedIn link, GitHub link, X link, email.

## Consulting CTA

> **Need a custom skill for your team?**
> I build agent-native workflows for design, marketing, and ad-ops teams. Book a 30-minute intro call.
> [Calendly embed]

This is **the actual product**. Everything on the page funnels here. See [[Consulting Funnel]].

## Footer

- Legal disclaimer (AI output, IP clearance, FTC/DSA/EU AI Act responsibility).
- Trademark nominative-use note (not affiliated with Pencil, etc.).
- Apache 2.0 license link.
- Contact email.
- Newsletter signup for future skills (low friction, separate from book-a-call).

## Tech stack

Host on Vercel or wherever joel.design lives. Static HTML or Next.js single page. No heavy framework needed.

Assets:
- Hero MP4 — self-hosted, <2MB.
- Thumbnails grid — pre-rendered PNG sprite for the "60 banners" proof image.
- No external fonts (GDPR).

## SEO targets

Primary keywords (page title + H1 variants):

- "automate banner ad sizes figma"
- "html5 banner generator free"
- "claude skill for designers"
- "bulk resize google ads banners"

Meta description:

> Generate every IAB banner size from one Figma frame or brief. Open source Claude Code skill. GSAP animation, clickTag-wired, Google/DV360/TTD/Adform validated. Free. Apache 2.0.

## What the page is *not*

- Not a marketing site for banner-forge-the-product. banner-forge is a funnel.
- Not a documentation site. Docs live in the GitHub README and this wiki.
- Not a SaaS signup flow. Nothing gated.
- Not a newsletter-first page. Email capture is footer-only.

## Related

- [[Consulting Funnel]]
- [[Launch Plan]]
- [[Naming and Positioning]]
- [[Joel Kelly]]

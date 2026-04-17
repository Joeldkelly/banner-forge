---
tags: [legal, gsap, risk]
---

# GSAP License Myth

> [!tip]
> **GSAP 3.13+ is 100% free for commercial use including ads as of April 2025.** The old "Business Green" tier no longer exists. Every previously paid plugin (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother) is now bundled and free.
>
> Reference: <https://gsap.com/licensing/>

This note exists because stale blog posts and Stack Overflow answers still cite the old license. Ad-ops teams will challenge it on review. Know the answer.

## The history

- **Pre-2024:** GreenSock sold a "Business Green" license tier (~$99/year) granting commercial use for ads and sites with direct revenue. Most marketing teams bought it. Trafficking teams required proof of the license for every zip submission.

- **October 2024:** Webflow acquired GreenSock.

- **April 2025:** GSAP 3.13 released under the free tier, eliminating the "Business Green" distinction. All previously paid plugins (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother, MotionPath, Observer, Draggable, Flip, others) are now included free for all commercial uses, including paid advertising.

## What this means for banner-forge

- **We inline GSAP into every zip.** ~25 KB minified.
- **No license fee.** No attribution requirement inside the zip (the NOTICE file in the repo is sufficient for the Apache 2.0 chain).
- **Ad-ops review:** the README includes an explicit callout linking to gsap.com/licensing for traffic teams who still think GSAP requires a business license.

## When ad-ops challenges the zip

Expected pushback (real quotes anonymized):

> "This banner uses GSAP. Please confirm the advertiser holds a GreenSock Business Green license."

> "We require a GSAP commercial license document for any zip under 5MB."

### The answer

Link to:

- <https://gsap.com/licensing/> — the current page, post-Webflow.
- The GreenSock blog post announcing the April 2025 change.
- GSAP 3.13 release notes.

Offer to add a brief comment in the zip's `<head>`:

```html
<!-- GSAP 3.13+ is free for commercial use. See gsap.com/licensing -->
```

This doesn't affect the zip size meaningfully and documents the licensing choice for future review.

## Why this matters for launch

Expect this question in HN comments, agency DMs, and ad-ops threads. The README addresses it up front, and we've written [references/LEGAL.md](../references/LEGAL.md) to link to the authoritative source.

## What could change

- Webflow could in theory re-introduce tiered pricing for future GSAP versions. If that happens, banner-forge pins to the last free version (`gsap@3.13.x`) and documents the choice.
- An alternative free animation library (Motion One, Anime.js v4) could become the default. For now, GSAP wins on industry adoption and plugin ecosystem.

## Related

- [[Licensing]]
- [[Animation Rules]]
- [[GSAP Template]]
- [references/LEGAL.md](../references/LEGAL.md)

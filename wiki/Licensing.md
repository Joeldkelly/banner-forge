---
tags: [legal, license]
---

# Licensing

## banner-forge license

**Apache License, Version 2.0.** Full text in [LICENSE](../LICENSE).

### Why Apache 2.0, not MIT

- **Patent grant.** Apache 2.0 includes an explicit patent grant. MIT does not. Ad-tech is patent-heavy; the grant matters.
- **Defensive termination.** If someone sues the project over patent infringement, their license auto-terminates.
- **Matches Anthropic's convention.** `anthropics/skills` is Apache 2.0. Consistency reduces agency legal-review friction.
- **NOTICE file support.** Apache 2.0's required NOTICE file gives a clean home for third-party attributions (sharp, Puppeteer, GSAP, etc.).

### Why not GPL

GPL would **block agency adoption**. Agencies' client contracts typically prohibit inclusion of copyleft-licensed code in deliverables. A GPL license makes the skill effectively off-limits for the target buyer.

### Why not MIT

MIT is simpler and works for most small libraries. For banner-forge specifically:

- We want the patent grant.
- We want the NOTICE file pattern.
- We have zero downside from Apache 2.0's slightly-more-verbose boilerplate.

### Why not BSD-3

No advantage over MIT for this case. Apache 2.0 wins the comparison.

## Third-party licenses bundled

See [NOTICE](../NOTICE) for the complete list. Summary:

| Dependency      | License             | In-zip? |
|-----------------|---------------------|---------|
| GSAP            | Commercial-free-for-all | Yes (inlined) |
| Puppeteer       | Apache 2.0          | No (dev only) |
| sharp           | Apache 2.0          | No       |
| archiver        | MIT                 | No       |
| terser, csso, svgo | MIT              | No       |
| @ad-preflight/cli | MIT               | No (dev only) |
| html5-validator | MIT                 | No (dev only) |
| ffmpeg-static   | LGPL-2.1 (binary); wrapper MIT | No; invoked as external process |
| gifski          | AGPL-3.0 (binary)   | Invoked as external process — not linked |
| Fontsource families | OFL / Apache / Ubuntu | **Yes** (embedded in V1 zips) |

### AGPL note (gifski)

gifski is **AGPL-3.0**. banner-forge invokes it as an external process and does not link or redistribute the binary. The AGPL's network-use and distribution clauses don't attach in this usage. But to be safe:

- `gifski` is an **optional** dependency. Users install it separately if they want GIF preview.
- banner-forge doesn't bundle the gifski binary.
- If a user ships the gifski binary along with their build, that's their AGPL decision, not ours.

### ffmpeg note

ffmpeg-static ships a libx264-linked ffmpeg binary. LGPL compatibility is maintained by:

- Using `ffmpeg-static` as a build-time runtime dependency (not bundled in the zip).
- Documenting the dependency in NOTICE.

## Output licenses

banner-forge does not assign a license to the banners it produces. The advertiser owns what they generate. The skill is the tool; the output is the user's work.

Exception: **AI-generated imagery (V1)** is subject to the constraints in [[Image Models]] and [[AI Disclosure]].

## The in-README disclaimer

Above the fold in README.md and [references/LEGAL.md](../references/LEGAL.md):

> This skill generates ad creative using third-party AI models and libraries. The maintainers provide the software AS IS with no warranty. You are responsible for: the truthfulness of ad claims, compliance with platform AI-disclosure requirements (Meta, TikTok, YouTube), IP clearance for brand names, logos, likenesses, fonts, and reference images, and compliance with FTC, state, EU DSA, and EU AI Act rules. AI-generated imagery is generally not copyrightable in the US without meaningful human authorship.

Apache 2.0 sections 7 and 8 already cover warranty and liability. This disclaimer reinforces them in plain language.

## Contributor License Agreement (CLA)

**None required for v0.1.** The Apache 2.0 section 5 ("Submission of Contributions") automatically licenses contributions under the same terms. Adding a CLA would slow first-contributor friction.

If banner-forge grows into a sponsored project or Joel sells consulting services built on it, a CLA (e.g., DCO-style sign-off) can be added later. For the solo-indie launch, no.

## Related

- [[GSAP License Myth]]
- [[Fonts Licensing]]
- [[Trademark]]
- [[AI Disclosure]]
- [references/LEGAL.md](../references/LEGAL.md)
- [LICENSE](../LICENSE) · [NOTICE](../NOTICE)

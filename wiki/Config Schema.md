---
tags: [architecture, config, schema]
---

# Config Schema

Every banner-forge run starts with a `banner.config.json` at the repo root. This note documents every field.

Canonical reference: [banner.config.example.json](../banner.config.example.json).

## Structure

```json
{
  "campaign":  { ... },
  "brand":     { ... },
  "creative":  { ... },
  "animation": { ... },
  "sizes":     [ ... ],
  "networks":  [ ... ],
  "limits":    { ... },
  "ai":        { ... }
}
```

## `campaign`

Identity of the campaign. Required.

```json
"campaign": {
  "name": "acme-spring-launch",
  "advertiser": "Acme Co.",
  "clickUrl": "https://acme.example.com/spring?utm_source=display&utm_campaign=spring-launch",
  "landingPageDomain": "acme.example.com"
}
```

| Field               | Required | Notes                                                                 |
|---------------------|----------|-----------------------------------------------------------------------|
| `name`              | yes      | Slug used in filenames and metadata                                   |
| `advertiser`        | yes      | Human-readable brand name                                             |
| `clickUrl`          | **yes**  | Must be `https://`. Becomes the `clickTag` value. See [[clickTag Pattern]] |
| `landingPageDomain` | no       | Used by some networks to cross-check the click URL                     |

**Validator error:** missing `campaign.clickUrl` or non-https URL fails the build hard. A clickTag without a URL is useless.

## `brand`

Visual identity.

```json
"brand": {
  "colors": {
    "primary": "#0A3D2E",
    "accent": "#F5B700",
    "background": "#FFFFFF",
    "text": "#111111",
    "ctaBackground": "#0A3D2E",
    "ctaText": "#FFFFFF"
  },
  "fonts": {
    "headline": { "family": "Figtree", "weight": 800, "source": "fontsource" },
    "body":     { "family": "Inter",   "weight": 500, "source": "fontsource" }
  },
  "logo": {
    "src": "./assets/logo.svg",
    "alt": "Acme Co."
  }
}
```

| Field                    | Required | Notes                                                |
|--------------------------|----------|------------------------------------------------------|
| `colors.primary`         | **yes**  | Brand primary                                        |
| `colors.accent`          | no       | Falls back to primary                                |
| `colors.background`      | no       | Default `#FFFFFF`                                    |
| `colors.text`            | no       | Default `#111111`                                    |
| `colors.ctaBackground`   | no       | Falls back to primary                                |
| `colors.ctaText`         | no       | Default `#FFFFFF`                                    |
| `fonts.headline.family`  | no       | Must be a [[Fonts Licensing\|licensed family]]; refused names are substituted |
| `fonts.body.family`      | no       | Same rules                                           |
| `logo.src`               | no       | SVG preferred; PNG also accepted                     |

See [[Fonts and Typography]] and [[Fonts Licensing]] for font rules.

## `creative`

Copy and imagery.

```json
"creative": {
  "headline": "Spring savings, sharper than ever.",
  "subhead": "Up to 30% off the entire line.",
  "cta": "Shop now",
  "legal": "Offer ends 5/15. See site for details.",
  "hero": {
    "src": "./assets/hero.jpg",
    "alt": "Product hero image",
    "focalPoint": { "x": 0.5, "y": 0.4 }
  }
}
```

| Field                   | Required | Notes                                                 |
|-------------------------|----------|-------------------------------------------------------|
| `headline`              | **yes**  | Truncated per-size via `headlineMaxWords` heuristic   |
| `subhead`               | no       | Hidden at sizes where `subheadSize = 0` (mobile banners) |
| `cta`                   | **yes**  | The button text                                       |
| `legal`                 | no       | Small print, bottom of frame                          |
| `hero.src`              | no       | Optional; neutral background if missing               |
| `hero.focalPoint.x/y`   | no       | 0-1 normalized. Controls `object-position` for crops  |

## `animation`

Which template to use and the scene timeline.

```json
"animation": {
  "template": "gsap",
  "durationSeconds": 15,
  "loops": 3,
  "scenes": [
    { "id": "intro",    "durationMs": 1200, "transition": "fade"     },
    { "id": "headline", "durationMs": 2000, "transition": "slide-up" },
    { "id": "subhead",  "durationMs": 1500, "transition": "fade"     },
    { "id": "cta",      "durationMs": 1800, "transition": "scale-in" }
  ]
}
```

| Field                  | Required | Notes                                                 |
|------------------------|----------|-------------------------------------------------------|
| `template`             | no       | `"gsap"`, `"css-only"`, `"static"`. Default `"gsap"`. Force-routed to `"css-only"` for sizes ≤50KB. |
| `durationSeconds`      | no       | Documentation only; hard cap 15s applied              |
| `loops`                | no       | 1-3; clamped                                          |
| `scenes[]`             | no       | Each scene targets a DOM id by `id`                   |
| `scenes[].transition`  | no       | `fade`, `slide-up`, `slide-down`, `scale-in`, `scale-out` |

See [[Animation Rules]].

## `sizes`

Array of size keys. Must exist in [[IAB Sizes|the size matrix]].

```json
"sizes": [
  "300x250", "336x280", "300x600",
  "728x90",  "970x90",  "970x250",
  "160x600", "120x600",
  "320x50",  "320x100", "300x50",
  "300x1050",
  "468x60",  "250x250", "200x200"
]
```

The 15 above are the MVP canonical set. Custom sizes require a code change in `scripts/lib/sizes.js`.

## `networks`

Array of network names. Each produces its own `dist/<network>/<size>.zip`.

```json
"networks": ["google", "dv360", "ttd", "adform"]
```

Valid: `google`, `dv360`, `ttd`, `adform`, `amazon` (V1). See [[Ad Networks]].

## `limits`

Hard caps the pipeline enforces.

```json
"limits": {
  "maxZipBytes": 150000,
  "maxAnimationSeconds": 15,
  "maxLoops": 3
}
```

Rarely changed. Per-network ceilings in `scripts/lib/networks.js` take precedence when stricter.

## `ai` (V1)

Reserved for image-generation config.

```json
"ai": {
  "disclosureRequired": true,
  "imageModel": null,
  "imageApiKeyEnv": null
}
```

MVP leaves `imageModel` null. V1 accepts `"nano-banana"`, `"flux-schnell"`, `"imagen"`, `"gpt-image-1"`. Never `"flux-dev"` — non-commercial. See [[Image Models]].

## Validation failures

`scripts/lib/config.js:validateConfig()` enforces:

- `campaign.name` required
- `campaign.clickUrl` required and must be http(s)
- `brand.colors.primary` required
- `creative.headline` required
- `creative.cta` required
- `sizes` non-empty array
- `networks` non-empty array
- Refused fonts (Helvetica/Futura/Gotham/Avenir/Proxima Nova) substituted with warning, not error

## Related

- [[Build Stage]] — reads this config
- [[Pipeline Overview]]
- [[IAB Sizes]]
- [[Ad Networks]]

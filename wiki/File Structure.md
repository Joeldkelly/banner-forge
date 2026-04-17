---
tags: [architecture, structure]
---

# File Structure

What lives where in the repo, and why.

## Top level

```
banner-forge/
├── SKILL.md                      # Claude reads this first
├── README.md                     # GitHub-facing
├── LICENSE                       # Apache 2.0 text
├── NOTICE                        # third-party attributions
├── package.json                  # node deps
├── banner.config.example.json    # user copies this to banner.config.json
├── .gitignore
├── .claude-plugin/
│   └── plugin.json               # enables `claude plugin install`
├── commands/                     # slash commands (user-invoked)
├── scripts/                      # pipeline scripts + shared libs
├── templates/                    # HTML/CSS/JS templates
├── references/                   # progressive-disclosure docs
├── assets/                       # fonts, placeholders (future)
├── examples/                     # worked examples
└── wiki/                         # this Obsidian vault
```

## `/SKILL.md`

The entrypoint Claude reads. Contains the orchestrator instructions, the happy path, failure modes, and references to deeper docs. Target: <500 lines, <5000 tokens. Every byte in SKILL.md is paid per conversation — keep it tight.

## `/commands/` — user-facing slash commands

Each `.md` file becomes a slash command in Claude Code when the plugin is installed.

```
commands/
├── banner-from-figma.md   # /banner-from-figma <url>
├── banner-from-brief.md   # /banner-from-brief <path>
├── banner-resize.md       # /banner-resize <build-dir>
├── banner-animate.md      # /banner-animate <build-dir>
├── banner-qa.md           # /banner-qa <zip-or-dir>
└── banner-export.md       # /banner-export <dir> --network ...
```

See [[Commands Overview]].

## `/scripts/` — the code

```
scripts/
├── build-all.sh           # orchestrates the four stages
├── build.js               # config → per-size HTML
├── render.js              # headless Chrome → PNG/MP4/GIF
├── package.js             # HTML → per-network zip
├── validate.js            # zip → pass/warn/fail
├── figma-import.js        # stub; real ingest runs through Claude + Figma MCP
└── lib/
    ├── config.js          # loadConfig + validateConfig
    ├── sizes.js           # SIZE_MATRIX + layout heuristics
    ├── networks.js        # per-network rules + Adform manifest shape
    └── template.js        # tiny mustache-ish interpolator
```

**Design rule:** each top-level script has exactly one job and can be run independently. Shared code goes in `lib/` as ES modules.

## `/templates/` — the HTML skeletons

```
templates/
├── gsap/
│   ├── index.html         # GSAP-animated banner template
│   ├── styles.css         # base styles with {{tokens}}
│   └── animation.js       # GSAP timeline, filled at build time
├── css-only/
│   ├── index.html         # zero-JS template for ≤50KB sizes
│   └── styles.css         # @keyframes animations
└── static/
    └── index.html         # single-image template
```

See [[GSAP Template]], [[CSS-only Template]], [[Static Template]].

## `/references/` — progressive-disclosure docs

Claude loads these **on demand**, not by default. Keeps SKILL.md lean.

```
references/
├── SIZES.md               # canonical size table + per-network ceilings
├── NETWORK_SPECS.md       # manifest, clickTag case, retina per network
├── CLICKTAG.md            # the exact dual-global snippet
├── ANIMATION.md           # GSAP vs CSS vs Lottie decision tree
├── IMAGE_MODELS.md        # Nano Banana, FLUX, licensing
└── LEGAL.md               # AI disclosure, fonts, trademark, FTC/DSA/EU AI Act
```

## `/examples/`

```
examples/
└── saas-product-launch/
    ├── banner.config.json  # copy-ready config
    ├── brief.md            # source brief (text-only campaign)
    └── README.md           # how to run the example
```

## `/wiki/` — this Obsidian vault

```
wiki/
├── Home.md                 # MOC
├── Glossary.md
├── Project Overview.md
├── Roadmap.md
├── Decisions Log.md
├── [architecture notes]
├── [pipeline stage notes]
├── [template notes]
├── [domain notes]
├── [command notes]
├── [launch notes]
├── [legal notes]
├── [people notes]
└── .obsidian/              # Obsidian app config
```

Wiki is **separate from** the in-repo docs. References link *to* the code, and the code's reference docs are authoritative. Wiki adds the *why* and the market context.

## `/assets/` (future)

```
assets/
├── fonts/                  # curated OFL/Apache fonts, self-hosted
├── placeholders/           # neutral hero/logo placeholders for demos
└── validators/             # test zips for CI (V1)
```

MVP doesn't populate this yet — user-supplied assets live in the consumer's project root (e.g. `./assets/hero.jpg`).

## What gets checked in vs. not

Checked in:
- All source (scripts, templates, references, SKILL.md, commands)
- The example config and brief
- This wiki

Not checked in (see [.gitignore](../.gitignore)):
- `node_modules/`
- `build/` and `dist/` (generated artifacts)
- `banner.config.json` (user's campaign config — may contain URLs/data they don't want public)
- `.env`

## Related

- [[Pipeline Overview]]
- [[Config Schema]]
- [[Why One Skill Not Many]]

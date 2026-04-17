---
tags: [commands, ux]
---

# Commands Overview

Six slash commands, not twenty. Each wraps a specific entry point into the pipeline. More commands fragment the docs and confuse new users.

## The six

| Command                | Purpose                                                          | When to use                                          |
|------------------------|------------------------------------------------------------------|------------------------------------------------------|
| `/banner-from-figma`   | Ingest a Figma frame → config → full pipeline                    | Designer has a master Figma frame                    |
| `/banner-from-brief`   | Read a brief (markdown) → synthesize config → full pipeline      | Copy-driven campaign, no Figma yet                   |
| `/banner-resize`       | Re-run build+package for new sizes only                          | Adding sizes to an existing campaign                 |
| `/banner-animate`      | Swap the animation template on an existing build                 | Copy is right but motion isn't                       |
| `/banner-qa`           | Validate existing zips without rebuilding                        | Spot-check or pre-delivery sanity                    |
| `/banner-export`       | Repackage for one specific network                               | A network rejected a zip, need to repackage          |

## How the skill registers commands

Each `commands/<name>.md` file has YAML frontmatter:

```yaml
---
description: One-line description shown in Claude's command palette.
argument-hint: <path-or-url> [--flag value]
---
```

When the plugin is installed, Claude picks these up automatically. The markdown body is the instruction Claude follows when the command fires.

## The full pipeline command

None. Just run `npm run all` or `/banner-from-brief` / `/banner-from-figma`. If you want to re-run the full pipeline with no re-ingest:

```bash
npm run all
```

The skill intentionally has no `/banner-run-all` slash command because slash commands are entry points — they bring you in with new input. The full pipeline re-run is just shell.

## `/banner-from-figma <url>`

See [commands/banner-from-figma.md](../commands/banner-from-figma.md).

Uses the Figma MCP (wired in Claude Code settings) to:
1. Pull the frame's dimensions, variables, and text styles.
2. Extract text layers by role (`headline/`, `subhead/`, `cta/`, `logo/`, `hero/`).
3. Write `banner.config.json`.
4. Fall through to the default pipeline.

**Graceful fallback:** free-seat Figma users can't do write-back. The skill logs a single warning and proceeds read-only.

## `/banner-from-brief <path>`

See [commands/banner-from-brief.md](../commands/banner-from-brief.md).

Reads a brief (markdown, text, or V1 PDF). Claude synthesizes brand tokens, copy, sizes, and networks, then runs the pipeline. The user reviews the synthesized config before the build kicks off.

Brief template (minimal):

```markdown
# Campaign name

**Advertiser:** ...
**Click URL:** https://...
**Brand colors:** primary #..., accent #...
**Fonts:** Figtree (headline), Inter (body)
**Copy:**
- Headline: ...
- Subhead: ...
- CTA: ...
**Sizes:** default 15
**Networks:** google, dv360, ttd, adform
```

## `/banner-resize <build-dir>`

See [commands/banner-resize.md](../commands/banner-resize.md).

Add sizes to an existing build without re-ingesting:

```
/banner-resize ./build --sizes 300x600,970x250
```

Skips figma ingest and copy synthesis. Reads the existing `banner.config.json`, overrides `sizes`, runs build/render/package/validate for just those sizes.

## `/banner-animate <build-dir> --template gsap|css-only|static`

See [commands/banner-animate.md](../commands/banner-animate.md).

Swap the animation without re-ingesting:

```
/banner-animate ./build/300x250 --template gsap
```

Re-runs build/render/package for the target dirs with a different template.

## `/banner-qa <zip-or-dir>`

See [commands/banner-qa.md](../commands/banner-qa.md).

Validation only. No rebuild. Use:

- **Before delivery** — spot-check zips before handing to a traffic team.
- **After a network rejection** — the error they returned; validate finds what's wrong.
- **On files built by hand** — banner-forge can validate any HTML5 banner zip, not just its own output.

## `/banner-export <dir> --network google|dv360|ttd|adform|amazon`

See [commands/banner-export.md](../commands/banner-export.md).

Repackage an existing build for one network. Use when:

- One specific network rejected a zip and you need to repackage with different manifest/clickTag settings.
- Adding a network to an existing campaign.

## Why six, not twelve

The research blueprint considered commands like `/banner-stats`, `/banner-benchmark`, `/banner-preview-web`, `/banner-lint`. All rejected because:

- Each command is a new door into the skill, and new doors fragment the user's mental model.
- "Stats" and "benchmark" fit inside `/banner-qa` output.
- "Preview-web" is just `open ./build/300x250/index.html` — not worth a command.
- "Lint" is `/banner-qa`.

## Related

- [[Pipeline Overview]]
- [[Config Schema]]
- [[File Structure]]

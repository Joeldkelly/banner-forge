---
tags: [architecture, design-philosophy]
---

# Why One Skill Not Many

A design decision worth a standalone note because it keeps coming up. banner-forge is **one skill**, not a federation of `banner-build`, `banner-render`, `banner-package`, `banner-validate` sub-skills.

## The pattern we're following

Every successful complex Claude skill from late 2025 forward converges on the same shape:

- One orchestrator `SKILL.md` at the repo root
- Progressive disclosure via a `references/` folder (loaded on demand)
- Deterministic Node/Python scripts in `scripts/`
- JSON sidecar artifacts between stages
- Single install command

Examples:

- `obra/superpowers` — one skill, many behaviors
- Remotion's official skill — one skill, full video pipeline
- Anthropic's own `frontend-design` — one skill, production-grade UI output

## Why not federated skills

### Metadata token cost

Every loaded skill pays for its frontmatter + name + description in the context of every conversation that could invoke it. Five sub-skills mean five entries in Claude's "available skills" list, each with its own trigger description. The overhead multiplies as the ecosystem grows.

### Install friction

`claude plugin install joeldkelly/banner-forge` is a clean one-liner. `install banner-build + banner-render + banner-package + banner-validate` requires four commands, dependency-coordination across versions, and a README section no one reads. First-install friction is the single biggest drop-off in open-source adoption.

### Fractured GitHub star economy

Stars compound. One repo with 800 stars beats four repos with 200 each. Every awesome-list PR mentions one repo by name; splitting dilutes every mention.

### Discovery problem

When a user asks "how do I generate display banners," Claude looks up skills by description. If the pipeline is one skill, there's one description that covers the whole flow. Split across four, each has to describe itself *and* hint at how they compose — complexity moves into natural language.

## The only time to split

When a sub-component becomes **independently useful to someone who doesn't want the whole pipeline.**

Candidates, in order of likelihood:

1. **A pure HTML5 validator skill** — `banner-validate` could be useful to someone building banners by hand and wanting a CI check. Low coupling to the rest of the pipeline.
2. **A pure Figma-to-tokens skill** — if Figma ingest becomes robust enough to be useful standalone.
3. **A pure per-network packager** — someone who builds their own HTML but wants banner-forge's zip packaging.

None of those are launch-blocking. They're post-MVP refactors if and only if demand emerges.

## Inside the skill: stages are *directories*

This is the other half of the pattern. Inside the single skill, the pipeline is broken into stages, but each stage is a **directory** in `./build/` with a canonical JSON sidecar that the next stage reads. This gives us most of the benefits of federation (resume, re-run, inspect) without the costs.

See [[Pipeline Overview]].

## What this looks like in practice

```
SKILL.md            ← Claude reads this. One file. <500 lines.
references/         ← loaded on demand.
  SIZES.md
  NETWORK_SPECS.md
  CLICKTAG.md
  ANIMATION.md
  IMAGE_MODELS.md
  LEGAL.md
scripts/            ← deterministic, independent stages.
  build.js
  render.js
  package.js
  validate.js
commands/           ← user-facing slash commands (six).
build/              ← stage outputs (JSON sidecars between stages).
dist/               ← final deliverables.
```

## The counter-example

`anthropic-skills` is a monorepo of many skills, not a federation. Each skill is self-contained, installed independently, and serves a distinct purpose. That's different from splitting one skill across multiple installs.

banner-forge-the-ecosystem could eventually look like `anthropic-skills`: a monorepo containing `banner-forge`, `figma-to-email`, `campaign-qa`, etc. Each would be one installable skill, with its own orchestrator. But the *banner generation pipeline* stays as one skill.

## Related

- [[Pipeline Overview]]
- [[File Structure]]
- [[Decisions Log]]

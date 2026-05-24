# Skill Patterns — plugin

A Claude / Codex / Gemini plugin that helps you **build better Skills**. When you create or improve an agent Skill, it works out which skill-design patterns the skill's purpose calls for and weaves them in — so you don't have to hand-pick them.

It ships the **skill-patterns** skill, backed by a catalog of 34 reusable behavioral patterns. Browse the full catalog at **[skillpatterns.ai](https://skillpatterns.ai)**.

> **Branches:** this `main` branch is the installable plugin. The website that publishes [skillpatterns.ai](https://skillpatterns.ai) lives on the [`gh-pages`](https://github.com/borkweb/skill-patterns/tree/gh-pages) branch.

## What it does

When you start writing or editing a `SKILL.md`, the skill:

1. Grounds in the full pattern catalog (a bundled snapshot).
2. Reads the skill's purpose — its inputs, outputs, and what could go wrong.
3. Selects the patterns that fit, applies the clear ones, and proposes the borderline ones.
4. Shows you what it applied and why, so you can adjust — or pick yourself.

Most skills need only 2–4 patterns; it keeps things lean and asks before anything high-stakes.

## Install

### Claude Code (plugin marketplace)

```
/plugin marketplace add borkweb/skill-patterns
/plugin install skill-patterns@skill-patterns
```

It then activates automatically when you build a Skill, or invoke it with `/skill-patterns:skill-patterns`.

### Codex, Gemini, Cursor, and other agents (npx skills)

```
npx skills add https://github.com/borkweb/skill-patterns --skill skill-patterns
```

### Manual (Claude Code)

Copy `skills/skill-patterns/` into `~/.claude/skills/` (personal) or a project's `.claude/skills/`.

## What's inside

```
.claude-plugin/
├── plugin.json          # plugin manifest
└── marketplace.json     # lets the repo be added as a marketplace
skills/
└── skill-patterns/
    ├── SKILL.md
    └── references/       # decision guide + catalog snapshot
```

## Keeping the catalog snapshot current

The skill bundles a snapshot of the catalog at `skills/skill-patterns/references/patterns.md`. When the catalog changes (on the `gh-pages` site), regenerate it:

```
curl -s https://skillpatterns.ai/llms.txt > skills/skill-patterns/references/patterns.md
```

## License

MIT — see `LICENSE`.

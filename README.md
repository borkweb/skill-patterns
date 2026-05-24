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

Built on the [Agent Skills open standard](https://agentskills.io), so the skill runs **unmodified** on Claude Code, Codex CLI, Gemini CLI, Cursor, GitHub Copilot, and 25+ other agents — the `.claude-plugin/` manifests just add Claude Code's marketplace install on top; other agents ignore them.

### Easiest — any agent

```
npx skills add https://github.com/borkweb/skill-patterns --skill skill-patterns
```

Installs the skill into the right location for whichever agent you're using.

### Claude Code (plugin marketplace)

```
/plugin marketplace add borkweb/skill-patterns
/plugin install skill-patterns@skill-patterns
```

It then activates automatically when you build a Skill, or invoke it with `/skill-patterns:skill-patterns`.

### Manual — copy the skill folder

Copy `skills/skill-patterns/` into your agent's skills directory:

| Agent | Personal | Project |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/` |

Codex and Gemini CLI also read the shared `.agents/skills/` alias.

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

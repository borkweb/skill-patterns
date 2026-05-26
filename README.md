# Skill Patterns — plugin

A Claude / Codex / Gemini plugin that helps you **build better Skills**. When you create or improve an agent Skill, it works out which skill-design patterns the skill's purpose calls for and weaves them in — so you don't have to hand-pick them.

It ships the **skill-patterns** skill, backed by a catalog of 38 reusable behavioral patterns. Browse the full catalog at **[skillpatterns.ai](https://skillpatterns.ai)**.

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
npx skills add borkweb/skill-patterns --skill skill-patterns
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

## License

MIT — see `LICENSE`.

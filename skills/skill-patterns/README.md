# skill-patterns

A skill that helps you **build better Skills**. When you're creating or improving an agent Skill, it figures out which skill-design patterns the skill's purpose calls for — grounding, critique, decision-making, output shaping, control, composition — and weaves them in for you, so you don't have to hand-pick them.

Backed by the catalog at [skillpatterns.ai](https://skillpatterns.ai).

## What it does

When you start writing or editing a `SKILL.md`, this skill:

1. **Grounds** in the full pattern catalog (bundled in `references/patterns.md`).
2. **Reads the skill's purpose** — what it does, its inputs/outputs, and what could go wrong.
3. **Selects the patterns that fit** using an intent → pattern guide (`references/choosing-patterns.md`), applies the clear fits, and proposes the borderline ones.
4. **Shows you what it applied and why**, so you can adjust — or take over and pick yourself.

It deliberately keeps things lean (most skills need only 2–4 patterns) and asks before anything high-stakes. You get pattern-informed skills by default, without reading the whole catalog or choosing manually.

## Install

### Via `npx skills` (recommended)

```bash
npx skills add https://github.com/borkweb/skill-patterns --skill skill-patterns
```

Once it's listed on [skills.sh](https://skills.sh), you can also discover it with:

```bash
npx skills find skill-patterns
```

The `npx skills` ecosystem installs into Claude Code, Cursor, Codex, Gemini CLI, and other supported agents.

### Manual — any agent

This skill follows the [Agent Skills open standard](https://agentskills.io), so the same `SKILL.md` works across agents unmodified. Copy the `skill-patterns` directory into your agent's skills folder:

```bash
cp -R skill-patterns ~/.claude/skills/skill-patterns    # Claude Code
cp -R skill-patterns ~/.codex/skills/skill-patterns     # Codex CLI
cp -R skill-patterns ~/.gemini/skills/skill-patterns    # Gemini CLI
```

Use the project-scoped path instead (`.claude/skills/`, `.codex/skills/`, `.gemini/skills/`) to share it within a repo. Codex and Gemini CLI also read the shared `.agents/skills/` alias. No restart needed for project skills.

## Using it

- **Automatic:** just start building a skill ("create a skill that…", "improve this SKILL.md") and it activates, applying the relevant patterns and noting what it chose.
- **Manual:** invoke `/skill-patterns` to apply it deliberately.
- **Drive it yourself:** say "let me pick" and it'll show the relevant patterns and apply only what you choose.

**Verify (Claude Code):** run `/help` and look for `skill-patterns` in the list.

## What's inside

```
skill-patterns/
├── SKILL.md                        # the skill: when it applies + the apply-by-default flow
└── references/
    ├── choosing-patterns.md        # intent → pattern decision guide
    └── patterns.md                 # full catalog snapshot (definitions + example prompts)
```

## Maintenance

`references/patterns.md` is a generated snapshot of the live catalog. When the catalog changes, regenerate it from the site's machine-readable export:

```bash
curl -s https://skillpatterns.ai/llms.txt > references/patterns.md
```

The catalog is also available as structured data at [`skillpatterns.ai/patterns.json`](https://skillpatterns.ai/patterns.json).

## License

MIT.

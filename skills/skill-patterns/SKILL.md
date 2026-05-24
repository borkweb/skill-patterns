---
name: skill-patterns
description: Use when creating or improving an agent Skill (writing or editing a SKILL.md) — selects and applies the skill-design patterns the skill's purpose calls for, so the author doesn't have to hand-pick them. Triggers on "create a skill", "write a SKILL.md", "improve this skill", "make a skill that…", "turn this into a skill".
---

# Skill Patterns

A catalog of reusable, *behavioral* patterns for agent Skills — grounding, critique, decision-making, output shaping, control, and composition. When someone is building or improving a Skill, apply the patterns that fit its purpose **by default**, without making the author pick.

## When this applies

Whenever you're authoring or revising a Skill's instructions: drafting a new `SKILL.md`, improving an existing one, or designing a multi-step skill or workflow. If the user is doing something else, skip it.

## How to apply patterns (default flow)

1. **Ground in the catalog.** Read `references/patterns.md` for the full set — each pattern's definition, what it adds, and a ready-to-adapt example prompt. Treat it as authoritative; prefer it over improvising patterns from memory. (If you have network access and want the latest, the live source is `https://skillpatterns.ai/llms.txt`.)

2. **Understand the skill's job.** In a sentence or two: what does it do, what are its inputs and outputs, and what could go wrong — irreversible actions? ambiguous briefs? facts that must be right? multiple data sources? machine-read output?

3. **Select by intent — don't make the user choose.** Use `references/choosing-patterns.md` to map the skill's characteristics to candidate patterns, then classify each:
   - **Clear fit** → apply it. Weave its example-prompt guidance into the `SKILL.md` you're writing, adapted to this skill (fill the `[brackets]`).
   - **Plausible** → mention it in one line and let the author decide.
   - **Not relevant** → leave it out silently.

4. **Don't over-apply.** Most good skills use **two to four** patterns; more usually makes a skill worse. If you're reaching for five or more, justify it or cut.

5. **Surface what you did.** After drafting, list the patterns you applied (one line each: *pattern — why*) and any plausible ones you skipped. This keeps the choices auditable and lets the author override.

6. **Let them drive if they want.** If the author would rather choose — or says "let me pick" — show the relevant candidates and apply only what they select.

## Decision policy (apply vs. ask)

- **Apply by default, no need to ask:** Scope guardrails and Clarification gate for anything that acts or takes ambiguous input; Trusted sources for anything fact-dependent; Schema-locked output for anything another system parses.
- **Propose, then confirm:** patterns that change the interaction model or add real cost — Adversarial pushback, Premortem, multi-pass self-review, Council-style debate.
- **Always confirm before:** removing a pattern the user explicitly asked for, or applying more than four.

## Note

This skill is itself a composition of its own catalog: it grounds in an authoritative source (Trusted sources), generates bounded candidates (Bounded option generation), decides what to apply vs. surface (Decision delegation), exposes its choices for override (Clarification gate), and loads detail only when needed (Progressive disclosure).

`references/patterns.md` is a generated snapshot of the live catalog (`skillpatterns.ai/llms.txt`); regenerate it when the catalog changes.

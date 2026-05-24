---
layout: page
title: Using the patterns
description: How to take a pattern's example prompt and put it to work in your own Skill.
permalink: /using/
---

# Using the patterns

## The basic move

1. Find a pattern that matches the behavior you want.
2. Copy its **example prompt partial**.
3. Fill in the `[bracketed]` slots with your specifics.
4. Paste it into your Skill's instructions (its `SKILL.md`) — or, for a one-off, straight into your prompt.

That's it. A pattern is just a well-worded instruction; the catalog saves you from rediscovering the wording every time.

## Choosing the right patterns

Not sure which to reach for? Match the *behavior of the skill* to a pattern:

| If the skill… | Reach for… |
|---|---|
| relies on facts that must be correct | Trusted sources, Confidence calibration |
| pulls from multiple sources or feeds | Graceful degradation, Signal vs. noise |
| often gets vague or ambiguous briefs | Clarification gate, Question sharpening |
| makes a recommendation or decision | Bounded option generation, Decision capture, Stakes-scaled rigor |
| reviews or evaluates work | Encoded reasoning, Gap-to-target scoring, Self-critique |
| must catch errors before it ships | Prove it works, Premortem, Failure mode preloading, Disconfirmation |
| takes an irreversible or high-stakes action | Human in the loop, Scope guardrails |
| runs autonomously or for a long time | Codified judgment, Circuit breaker, Long-term memory |
| produces a deliverable in a set format | Artifact creation, Format projection |
| feeds another system (machine-readable) | Schema-locked output |
| encodes one tool or library's conventions | Convention wrapper |
| should match a particular voice or style | Exemplars over instruction |
| is a multi-step or multi-skill workflow | Decomposition, Workflows as superset, Externalized working state, Progressive disclosure |
| tends to produce people-pleasing answers | Anti-sycophancy |
| benefits from a specific expert stance | Role priming |

Most skills need **two to four** of these — composing more usually makes a skill worse, not better.

**Building with an AI?** You don't have to pick at all. Point it at the catalog — [`/llms.txt`]({{ '/llms.txt' | relative_url }}) or [`/patterns.json`]({{ '/patterns.json' | relative_url }}) — and ask it to apply the patterns your skill's purpose calls for. It can select and weave them in, then show you what it chose so you can adjust.

## Fill in the brackets

The `[brackets]` are slots, not literal text. The Convention wrapper prompt, for instance, starts:

> When the task involves `[tool / library / domain]`, follow these conventions: `[rules, or point to a reference doc]`…

Replace `[tool / library / domain]` with `FastAPI`, swap in your actual conventions, and it's ready.

## Compose several

Patterns stack — most real Skills use two or three. Pick them in the order the work flows. A "draft a proposal" Skill might combine three:

```text
# 1 — Clarification gate
Before producing the proposal, if anything ambiguous would change the result —
scope, audience, budget — ask me those questions first and wait.

# 2 — Bounded option generation
Then generate 3 meaningfully different directions. For each, name what it
optimizes for and what it gives up. Recommend one, and say why not the others.

# 3 — Decision capture
Alongside the recommendation, capture the assumptions you made and the
alternatives you rejected, written for someone who wasn't in the room.
```

Each block is one pattern, lightly adapted. Together they turn a vague "write me a proposal" into a reliable flow.

## Test and adapt

Patterns are starting points, not law. Run your Skill, watch where the agent drifts, and tighten the wording — make a criterion stricter, add a placeholder, or drop a step that's overkill. The prompts in the catalog are written to be edited.

[Browse the patterns →]({{ '/' | relative_url }}) · [What are skill patterns? →]({{ '/about/' | relative_url }})

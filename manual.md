---
layout: doc
title: Manual usage
description: Place patterns by hand — copy a prompt partial, fill in the brackets, and compose a few.
permalink: /manual/
---

# Manual usage

Prefer to place patterns by hand instead of letting an AI do it? Here's the whole workflow. (To install the Skill and let AI apply patterns for you, see [Install]({{ '/install/' | relative_url }}).)

## Build manually

1. Find a pattern that matches the behavior you want.
2. Copy its **example prompt partial**.
3. Fill in the `[bracketed]` slots with your specifics.
4. Paste it into your Skill's instructions (its `SKILL.md`) — or, for a one-off, straight into your prompt.

That's it. A pattern is just a well-worded instruction; the catalog saves you from rediscovering the wording every time.

### Choosing patterns

Not sure which to grab? [Browse the catalog]({{ '/patterns/' | relative_url }}) — it's grouped by purpose, so skim the category that fits your skill's job. Most skills need only **two to four** patterns; composing more usually makes a skill worse. Or skip the picking entirely and let an AI choose (see [Install]({{ '/install/' | relative_url }})).

### Fill in the brackets

The `[brackets]` are slots, not literal text. The Scoped conventions prompt, for instance, starts:

> When the task involves `[tool / library / domain]`, follow these conventions: `[rules, or point to a reference doc]`…

Replace `[tool / library / domain]` with `FastAPI`, swap in your actual conventions, and it's ready.

### Compose several

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

[Browse the patterns →]({{ '/patterns/' | relative_url }}) · [Install the Skill →]({{ '/install/' | relative_url }})

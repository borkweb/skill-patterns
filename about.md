---
layout: page
title: What are skill patterns?
description: Reusable, composable techniques for shaping how an AI agent behaves.
permalink: /about/
---

# What are skill patterns?

A **skill pattern** is a small, reusable technique you drop into an AI Skill — or even a single prompt — to make an agent behave a specific way: ground itself in trusted sources, pause before something risky, stress-test its own work, or shape its output to fit a format.

They're **behavioral**, not domain-specific. A pattern doesn't know anything about your codebase or your business — it encodes a *way of working* that holds up across tasks. That's what makes it reusable: the same "ask clarifying questions first" move is useful whether you're drafting a contract or refactoring code.

## Why use them

- **Consistency.** Turn a prompt that happened to work once into repeatable behavior you can rely on.
- **Composability.** Patterns stack. Combine a few and you've built a richer, more reliable Skill.
- **Shared language.** "Add a clarification gate" or "run a premortem" is faster to say — and clearer — than re-explaining the idea every time.

## The five categories

Patterns are grouped by what they're *for*:

- **Grounding & accuracy** — keep the agent tethered to truth and honest about what it knows.
- **Critique & stress-testing** — find weaknesses before the work ships.
- **Decision-making** — structure how choices get made and recorded.
- **Output shaping** — control the form and structure of what comes out.
- **Control & composition** — govern flow, stance, and how Skills combine.

## What each pattern gives you

Every pattern in the catalog has the same shape: a one-line **definition**, a short list of **what it adds**, and a copyable **example prompt partial** — a ready-to-use snippet with `[bracketed]` slots you fill in with your specifics.

[Browse the patterns →]({{ '/' | relative_url }}) · [How to use them →]({{ '/using/' | relative_url }})

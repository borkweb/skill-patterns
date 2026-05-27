# Skill Patterns Site — Design Spec

**Date:** 2026-05-23
**Status:** Implemented (hybrid redesign — see Update below)

> **Update (post-implementation):** Shipped as a **hybrid**, not the original single-page-with-anchors model: a scannable card **index** links to a **page per pattern** (`/patterns/<slug>/`) for SEO. Adds per-page meta (description, canonical, Open Graph), `sitemap.xml` + `robots.txt`, FontAwesome Free icons per pattern, and **alphabetical ordering by title** within each category (the `order` field is no longer used for sorting). Three titles were shortened: "Trusted sources", "Clarification gate", "Progressive disclosure". Sections below that describe the single-page model, scroll-spy, or per-pattern pages as out-of-scope are superseded by this update.
**Source material:** An original set of 14 skill patterns (each with a definition, "what it adds", and an example prompt partial) and a curated list of external references and reference skills, plus later additions (clarification gate, failure-mode preloading, progressive disclosure, convention wrapper, graceful degradation, and a set adapted from the gstack review and discernment skills, plus decomposition, long-term memory, scope guardrails, schema-locked output, and self-tuning) — 34 patterns total. `_patterns/*.md` is the source of truth for the current set.

## Overview

A clean, public GitHub Pages site that documents common **skill patterns** — reusable techniques people can compose into Claude/agent Skills to bake in specific interactions, flows, and behaviors. The heart of the site is a browsable, searchable catalog of 34 patterns (an original set of 14 plus later additions), each with a definition, what it adds, and a copyable example prompt partial.

## Goals

- Make the 34 patterns easy to **browse, scan, and search**.
- Let people **copy each pattern's example prompt partial** in one click.
- Look **clean and polished** in both light and dark themes.
- Be **low-maintenance**: native Jekyll build on GitHub Pages, no CI workflow.
- Stay **product-neutral and public-friendly**, with light Automattic credit.

## Non-goals (out of scope for v1)

- Per-pattern detail pages (we use a single page + anchors).
- A build-time search index library (lunr/Pagefind) — client-side DOM filtering is enough for 14 items.
- Broader narrative material (what Skills are, the improvement lifecycle, evals, finding/sharing). Patterns-first only.
- The canonical 01–14 numbering (dropped in favor of purpose-based grouping).
- Analytics, comments, CMS.

## Audience

Anyone building skills for Claude Code / Cowork or other agents. Tone and content are product-neutral. Automattic gets a light credit in the footer; no internal-only links (e.g. `mc.a8c.com`) on the public site.

## Locked decisions

| Decision | Choice |
|---|---|
| Scope | Patterns-first catalog |
| Audience | Public & general, product-neutral |
| Organization | Grouped by purpose, **no numbers**, searchable |
| Tooling | Jekyll (GitHub Pages native build) |
| Layout | Sidebar nav + content (Layout B) |
| Page model | Single page + anchor nav, scroll-spy |
| Theme | Light + dark, toggle, defaults to system preference |
| Publishing | Custom apex domain `skillpatterns.ai` (`baseurl: ""`) |

## Information architecture

- **Home (`/`)** — the single catalog page:
  - Header: logo ("SkillPatterns"), theme toggle, GitHub link.
  - Sidebar: search box (focusable with `/`) + category nav listing each category and its patterns.
  - Main content: a short intro ("what skill patterns are / how to use these") followed by all 14 patterns grouped by category, each with an anchor (`#slug`).
- **Resources (`/resources/`)** — a small separate page with curated external links and a set of reference skills.
- **Footer** — Automattic credit line, license, GitHub link. Present on both pages.

## Content model

Each pattern is one Markdown file in a `_patterns/` Jekyll collection. The collection has `output: false` — we do **not** generate per-pattern pages; the home page iterates `site.patterns`. Structured fields live in frontmatter so rendering and the copy button are exact:

```yaml
---
title: "Trusted sources / grounding"
slug: trusted-sources        # anchor id; also derivable from filename
category: grounding          # key into _data/categories.yml
order: 1                     # sort order within the category
summary: "Anchors the agent in specific authoritative references so it stops improvising from training data."
adds:
  - "Cites which source supports each claim"
  - "Defers to specified sources when they conflict with general knowledge"
  - "Flags gaps instead of filling them silently"
prompt: |
  Ground this Skill in the following authoritative sources: [URLs / paths / docs]. When the task touches this area, consult these first. If your training contradicts these sources, the sources win. Cite which source each claim comes from. If a source is missing or ambiguous, flag the gap rather than filling it from prior knowledge.
---

<!-- Optional Markdown body: extended notes, "when to use", "pairs well with". Empty for v1. -->
```

Categories are defined once in `_data/categories.yml` (key, title, description, order) so the taxonomy and its ordering are editable in one place.

```yaml
- key: grounding
  title: "Grounding & accuracy"
  description: "Keep the agent tethered to truth and honest about what it knows."
  order: 1
- key: critique
  title: "Critique & stress-testing"
  description: "Find weaknesses before the work ships."
  order: 2
- key: decision
  title: "Decision-making"
  description: "Structure how choices get made and recorded."
  order: 3
- key: output
  title: "Output shaping"
  description: "Control the form and structure of what comes out."
  order: 4
- key: control
  title: "Control & composition"
  description: "Govern flow, stance, and how Skills combine."
  order: 5
```

## Category taxonomy

| Category | Patterns (in order) |
|---|---|
| **Grounding & accuracy** | Trusted sources · Exemplars over instruction · Confidence calibration · Convention wrapper · Graceful degradation · Signal vs. noise |
| **Decision-making** | Bounded option generation · Decision capture · Question sharpening · Stakes-scaled rigor |
| **Output shaping** | Format projection · Artifact creation · Schema-locked output |
| **Critique & stress-testing** | Encoded reasoning · Self-critique · Adversarial push back · Premortem · Failure mode preloading · Prove it works · Disconfirmation · Gap-to-target scoring · Self-tuning |
| **Control** | Clarification gate · Human in the loop · Circuit breaker · Codified judgment · Anti-sycophancy · Role priming · Scope guardrails |
| **Composition** | Workflows as superset · Externalized working state · Progressive disclosure · Decomposition · Long-term memory |

## Pattern content (original transcription — `_patterns/*.md` is the source of truth for all 34 patterns)

Each entry maps directly to one `_patterns/*.md` file.

### Grounding & accuracy

**Trusted sources** (`trusted-sources`, order 1)
- Summary: Anchors the agent in specific authoritative references so it stops improvising from training data.
- What it adds:
  - Cites which source supports each claim
  - Defers to specified sources when they conflict with general knowledge
  - Flags gaps instead of filling them silently
- Prompt: Ground this Skill in the following authoritative sources: [URLs / paths / docs]. When the task touches this area, consult these first. If your training contradicts these sources, the sources win. Cite which source each claim comes from. If a source is missing or ambiguous, flag the gap rather than filling it from prior knowledge.

**Exemplars over instruction** (`exemplars-over-instruction`, order 2)
- Summary: Anchors the Skill's output in concrete examples of "good" rather than describing it in rules.
- What it adds:
  - Matches the shape, voice, and structure of provided examples
  - Surfaces which exemplar it drew from when the choice is ambiguous
  - Asks for a new exemplar when the work falls outside the set
- Prompt: Here are exemplars of [strong outputs / preferred voice / target format]: [paste 2-4 examples]. Match the shape and voice of these rather than following rules I might write down. When the task falls outside what the exemplars cover, say so and ask for a new exemplar instead of guessing. Cite which exemplar most influenced the output.

**Confidence calibration** (`confidence-calibration`, order 3)
- Summary: Requires the agent to mark which parts of its output it's confident about and which are guesses.
- What it adds:
  - Tags claims by certainty so high-risk pieces are visible at a glance
  - Distinguishes what's verified against sources from what's inferred or assumed
  - Tells you where to spend your verification time and where you can move fast
- Prompt: As you produce [output], mark each substantive claim with a confidence level: high (verified against a source or directly observable), medium (inferred from pattern or adjacent evidence), low (filling a gap, best guess, please verify). For low-confidence claims, briefly note what would raise the confidence — a source to check, a test to run, a person to ask. Don't smooth out uncertainty in the final wording; if it's a guess, it should read like one.

**Convention wrapper** (`convention-wrapper`) — *later addition (adopted from the ADK "Tool Wrapper" pattern)*
- Summary: Packages a specific tool, library, or domain's conventions as on-demand knowledge the Skill applies only when that area is in play.
- What it adds:
  - Encodes the right way to use a specific tool or library, not generic advice
  - Activates only when the task actually touches that area
  - Keeps the detailed reference out of context until it's needed
- Prompt: When the task involves [tool / library / domain], follow these conventions: [rules, or point to a reference doc]. Use this specific guidance rather than generic best practices, and only pull in the detailed reference when the task actually touches [area]. If a convention here conflicts with your default approach, this guidance wins. If the task is outside [area], ignore this.

**Graceful degradation** (`graceful-degradation`) — *later addition*
- Summary: When an input or source is unavailable, the Skill produces the best partial result and flags what was missing, instead of blocking or guessing.
- What it adds:
  - Continues with available inputs when a source fails
  - Names which sources were unavailable and what they'd have affected
  - Marks the result as partial rather than presenting it as complete
- Prompt: If a required input or source is unavailable or errors out, don't block or silently fill the gap. Proceed with what you have, clearly mark the result as partial, and list which sources were missing and what they affected. Only hard-stop if a missing input makes the whole task meaningless — and say which one.

### Critique & stress-testing

**Encoded reasoning** (`encoded-reasoning`, order 1)
- Summary: Bakes review rubrics, validation steps, and quality checks into how the Skill operates.
- What it adds:
  - Runs outputs against a defined rubric before returning them
  - Surfaces which criteria passed, failed, or are uncertain
  - Catches predictable failure modes the team has seen before
- Prompt: Before returning output, check the work against these criteria: [rubric items]. Report which criteria passed, failed, or are uncertain. Don't return work that fails [hard criteria] — revise and retry. Surface the rubric results alongside the output so I can see the reasoning.

**Self-critique** (`self-critique`, order 2)
- Summary: Has the agent review its own output against criteria, identify weaknesses, and revise before returning.
- What it adds:
  - Produces a first draft, then critiques it against the brief
  - Names the weakest reasoning and the most fragile assumption
  - Returns the revised output with a note on what changed and why
- Prompt: After producing [output], step back and critique your own work against [criteria: the original brief, the rubric, what a strong reviewer would notice]. Identify the weakest reasoning, the most fragile assumption, and the part most likely to be wrong. Revise. Return the revised output along with a brief note on what changed and why.

**Adversarial push back** (`adversarial-push-back`, order 3)
- Summary: Pits a challenger persona or parallel agent against the work to expose weaknesses before it ships.
- What it adds:
  - Argues the strongest case against the proposal, with reasoning
  - Surfaces assumptions that wouldn't survive scrutiny
  - Forces defense of choices instead of quiet acceptance
- Prompt: Before finalizing [output], take the role of [adversary: skeptical reviewer, hostile architect, opposing counsel, competitor's CTO]. Argue the strongest case against the proposal. Identify the assumptions most likely to fail, the evidence that's missing, and the decisions that would look wrong in hindsight. Return the pushback and the original work side by side.

**Premortem** (`premortem`, order 4)
- Summary: Skill imagines the work has already failed and reasons backward to why.
- What it adds:
  - Generates the most plausible failure stories before the work ships
  - Surfaces risks that wouldn't appear in a forward-looking review
  - Names which current assumptions, if wrong, cause the failure
- Prompt: Before finalizing [the plan / the decision / the proposal], run a premortem. Imagine it's [6 months / a year / one quarter] from now and this work has clearly failed. Generate the 3 most plausible failure stories — what went wrong, in what order, and why it wasn't caught in time. For each, name the assumption in the current plan that, if wrong, made the failure inevitable. Return the failure stories alongside the original work, with the riskiest assumptions called out.

**Failure mode preloading** (`failure-mode-preloading`, order 5) — *later addition*
- Summary: Names the specific ways this kind of work tends to go wrong, so the agent watches for them.
- What it adds:
  - Lists the known failure modes for this kind of task up front
  - Watches for each one while working, not only at the end
  - Flags when the work starts drifting toward a named failure mode
- Prompt: Before starting [task], name the specific ways this kind of work usually goes wrong — [known failure modes, or ask me for them]. Keep that list in view as you work and check against it as you go, not only at the end. If the work starts drifting toward one of these failure modes, stop and flag it rather than pushing through. In the result, note which failure modes you actively guarded against.

### Decision-making

**Bounded option generation** (`bounded-option-generation`, order 1)
- Summary: Forces a fixed number of distinct alternatives with trade-offs before converging on a recommendation.
- What it adds:
  - Generates options that are genuinely different, not variations
  - Names what each option optimizes for and what it gives up
  - Recommends one, addressing why not the others
- Prompt: Before recommending [a decision / an approach], generate [3] meaningfully different options. Each must take a different bet — not variations of the same shape. For each, name what it's optimizing for and what it's giving up. Then recommend one, including why the other options were rejected rather than only why this one wins.

**Decision capture** (`decision-capture`, order 2)
- Summary: Surfaces the assumptions, alternatives considered, and reasoning trail alongside the output so the decision is auditable.
- What it adds:
  - Records what was assumed and what was uncertain
  - Lists alternatives considered and why they were rejected
  - Writes the reasoning trail for a reader who wasn't in the room
- Prompt: Alongside [the output / the recommendation], capture: the assumptions you made, the alternatives you considered, the reasoning that led to this choice, and the conditions under which you'd revisit it. Write it for a reader who wasn't in the room. Keep it short — enough that someone three months from now can tell whether the decision still holds.

### Output shaping

**Format projection** (`format-projection`, order 1)
- Summary: Renders one canonical artifact into multiple downstream forms while preserving the underlying content.
- What it adds:
  - Produces the source artifact once, then derives variants from it
  - Each variant matches its channel's conventions (length, tone, format)
  - Surfaces what was cut or compressed in each derivation
- Prompt: Produce the canonical [artifact: decision doc, spec, research summary] first. Then derive these variants from it: [list: P2 post, Slack summary, exec brief, email update]. Each variant should match the conventions of its channel. Don't re-reason — derive. Note what was cut or compressed in each variant so I can spot if something important got lost.

**Artifact creation** (`artifact-creation`, order 2)
- Summary: Directs the Skill to produce a concrete, standalone deliverable rather than a conversational response.
- What it adds:
  - Returns a finished artifact (doc, deck outline, spec, mockup, dataset) you can lift out and use
  - Matches a defined structure or template so the output is predictable
  - Separates the artifact from the surrounding chatter — you know what to keep
- Prompt: Produce a standalone [artifact type: brief, spec, one-pager, dashboard outline, draft P2 post] rather than answering conversationally. Follow this structure: [sections / template / required fields]. Return the artifact as a self-contained block I can copy out. Keep commentary about the artifact separate from the artifact itself — if you need to flag assumptions or open questions, put them after, not inside.

### Control & composition

**Human in the loop** (`human-in-the-loop`, order 1)
- Summary: Inserts explicit checkpoints where the agent pauses for discernment before proceeding.
- What it adds:
  - Stops before destructive, irreversible, or high-stakes steps
  - Surfaces what it's about to do and waits for confirmation
  - Distinguishes routine steps (proceed) from judgment calls (pause)
- Prompt: Before [specific actions: deploying, sending, deleting, committing, finalizing], pause and summarize what you're about to do and why. Wait for my confirmation, redirect, or override before proceeding. Routine steps can run without checkpoints; judgment calls always pause. [When presenting me with options, allow me to keep the default, give me two more, and let me enter my own.]

**Role priming** (`role-priming`, order 2)
- Summary: Puts the agent in a specific stance for the duration of the Skill so its reasoning carries that perspective.
- What it adds:
  - Approaches the work from the named role's priorities and constraints
  - Uses the vocabulary and reference points of that role
  - Stays in role across follow-ups within the same task
- Prompt: Approach this work as [role: staff engineer reviewing a PR, finance partner reviewing a forecast, support lead reviewing a flow]. Use the priorities, vocabulary, and constraints that role brings. Stay in role across follow-up questions within this task. If you'd break role to be more helpful, say so and ask before switching.

**Workflows as superset** (`workflows-as-superset`, order 3)
- Summary: Composes this Skill with others into a sequenced flow.
- What it adds:
  - Triggers other Skills in a defined order
  - Passes outputs from one stage as inputs to the next
  - Surfaces workflow state so you can see where you are in the chain
- Prompt: Run this as a workflow: [Skill 1] → [Skill 2] → [Skill 3]. Pass the output of each stage as input to the next. After each stage, summarize what was produced and confirm before moving on. If a stage fails its checks, stop and surface the issue rather than continuing.

**Clarification gate** (`clarification-gate`, order 4) — *later addition*
- Summary: Makes the agent ask clarifying questions before producing output when the brief is ambiguous.
- What it adds:
  - Detects ambiguity or missing constraints before starting work
  - Asks only the questions whose answers would change the output
  - Holds off on producing until the brief is clear enough to commit to
- Prompt: Before producing [output], check whether the brief is clear enough to commit to. If anything ambiguous would change the result — scope, audience, constraints, definition of done — ask me those questions first, as one short batch, and wait. Only ask what you genuinely can't proceed without; don't ask things the brief already answers. If it's already clear, say so and proceed without stalling.

**Progressive disclosure** (`progressive-disclosure`, order 5) — *later addition*
- Summary: Loads only the context needed for the current sub-task, expanding as the work deepens.
- What it adds:
  - Starts with the minimum context the current step requires
  - Pulls in more detail only when the work actually reaches it
  - Keeps unrelated material out of the way until it's relevant
- Prompt: Work through [task] in stages, loading only the context each stage needs. Start with the high-level [overview / index / table of contents]; pull in the detailed [files / sections / data] only when a step actually requires them. Don't front-load everything. When you move to a new sub-task, say what additional context you're bringing in and why, so the scope stays visible.

## Visual design

- **Themes:** light and dark, implemented with CSS custom properties on `:root` and `[data-theme="dark"]`. A no-flash inline script in `<head>` sets `data-theme` from `localStorage` (falling back to `prefers-color-scheme`) before first paint. The header toggle flips and persists the value.
- **Accent:** Automattic blue `#3858E9` (light); a brighter `#6B8AFF` for accents/links in dark mode.
- **Typography:** system sans-serif stack for UI/prose; monospace for the prompt partial body.
- **Pattern block:** category eyebrow (uppercase, accent) → title (`h2`/`h3`, bold) → summary → "What it adds" list (custom `+` bullets in accent) → example prompt partial.
- **Example prompt partial component:** a bordered amber panel for the example prompt. Header row with the label "EXAMPLE PROMPT PARTIAL" and a **Copy** button; monospace body. In dark mode the panel becomes a dark amber surface. The Copy button copies the exact `prompt` text and shows a transient "Copied!" state.
- **Accessibility:** semantic landmarks (`header`/`nav`/`main`/`footer`), labeled theme toggle, visible focus styles, sufficient contrast in both themes, `prefers-reduced-motion` respected for any scroll/transition.

## Search & interactions (vanilla JS, no dependencies)

- **Live search:** typing in the box filters patterns by title, summary, and "what it adds" text (case-insensitive substring). Non-matching pattern blocks hide; categories with zero visible patterns collapse (both in the sidebar and the main content). Clearing the box restores everything. `/` focuses the search box; `Esc` clears it.
- **Anchor nav + scroll-spy:** each sidebar pattern link targets `#slug`. An `IntersectionObserver` highlights the active pattern as the reader scrolls. Direct links to `#slug` scroll to and highlight the pattern.
- **Copy:** each prompt partial's Copy button writes `prompt` text to the clipboard via the async Clipboard API, with a fallback, and shows "Copied!" for ~1.5s.

## Build & deploy

- **Jekyll**, served by GitHub Pages' native **Deploy from branch** (Settings → Pages → Source: `main`, folder `/` root). No GitHub Action.
- `_config.yml` highlights:
  - `title: "Skill Patterns"`, `url: "https://skillpatterns.ai"`, `baseurl: ""`.
  - `collections.patterns.output: false`.
  - `markdown: kramdown`.
  - Sort patterns by `category` order then `order`.
- `CNAME` file containing `skillpatterns.ai`.
- `Gemfile` pinning the `github-pages` gem for faithful local preview (`bundle exec jekyll serve`).
- **DNS (apex domain) the user must configure** at the registrar:
  - A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - AAAA records → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - Optional `www` CNAME → `<user>.github.io`
  - Enable "Enforce HTTPS" in Pages settings once the cert provisions.

## Proposed file structure

```
/
├── _config.yml
├── CNAME                      # skillpatterns.ai
├── Gemfile
├── index.html                # layout: home — the catalog page
├── resources.md              # layout: default — resources page
├── _data/
│   └── categories.yml
├── _patterns/                # 17 Markdown files (collection, output: false)
│   ├── trusted-sources.md
│   ├── exemplars-over-instruction.md
│   ├── confidence-calibration.md
│   ├── convention-wrapper.md
│   ├── graceful-degradation.md
│   ├── encoded-reasoning.md
│   ├── self-critique.md
│   ├── adversarial-push-back.md
│   ├── premortem.md
│   ├── bounded-option-generation.md
│   ├── decision-capture.md
│   ├── format-projection.md
│   ├── artifact-creation.md
│   ├── human-in-the-loop.md
│   ├── role-priming.md
│   ├── workflows-as-superset.md
│   ├── clarification-gate.md
│   ├── failure-mode-preloading.md
│   └── progressive-disclosure.md
├── _layouts/
│   ├── default.html          # head, header, footer wrapper
│   └── home.html             # sidebar + content composition
├── _includes/
│   ├── head.html             # meta, theme no-flash script, asset links
│   ├── header.html           # logo, theme toggle, GitHub link
│   ├── sidebar.html          # search + category/pattern nav
│   ├── pattern.html          # one rendered pattern block
│   └── footer.html           # credit, license, links
└── assets/
    ├── css/style.css         # tokens + light/dark themes + layout
    └── js/app.js             # search, scroll-spy, copy, theme toggle
```

## Resources page content

External links (public, product-neutral):
- **Agent Skills open standard** — agentskills.io
- **Anthropic Skills repo** — github.com/anthropics/skills
- **Claude Code / Skills docs** — docs.anthropic.com/en/docs/claude-code
- **Engineering blog** — anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **skills.sh** — the open agent skills ecosystem (searchable, ratings); `npx skills find <query>`
- **WordPress agent skills** — github.com/WordPress/agent-skills
- **Automattic design skills** — github.com/Automattic/design-skills

Reference skills to study — present as a short annotated list; the implementer verifies/links each repo where public:
- caveman · council · grill-with-docs · humanize · prototype · red-pen (skills)
- voiceprint · frontend-designer · last30days · superpowers · borkweb/skills (plugins)

Footer: a neutral tagline ("Reusable patterns for composing AI Skills.") plus the GitHub source link. Repo license: MIT (existing `LICENSE`).

## Open items / future

- Confirm exact repo URLs for the reference skills during implementation; omit any that aren't publicly linkable.
- Future (not v1): per-pattern pages, a "copy all patterns" export, contribution guide for adding patterns, broader narrative material.

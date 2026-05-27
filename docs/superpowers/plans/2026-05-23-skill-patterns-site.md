# Skill Patterns Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, public, light/dark Jekyll site that presents the 14 skill patterns as a searchable, purpose-grouped catalog with copyable example prompts, deployed on GitHub Pages at the apex domain `skillpatterns.ai`.

**Architecture:** A static Jekyll site built natively by GitHub Pages (no CI). Patterns are a `_patterns` collection (`output: false`) authored as Markdown-with-frontmatter; categories live in `_data/categories.yml`. A single home page renders a sticky sidebar (search + category nav) beside a content column that groups all patterns by category with anchor IDs. Vanilla JS (no dependencies) provides search filtering, scroll-spy active-link highlighting, per-prompt copy buttons, and a persistent light/dark theme toggle. A separate Resources page lists external links and reference skills.

**Tech Stack:** Jekyll (via the `github-pages` gem), Liquid templates, Kramdown Markdown, CSS custom properties for theming, vanilla ES5-compatible JavaScript. Verification uses `bundle exec jekyll build` + HTML assertions and Playwright (MCP browser tools) for runtime behavior.

**Source of truth for content:** `docs/superpowers/specs/2026-05-23-skill-patterns-site-design.md` (full transcription of all 14 patterns). This plan inlines every value needed; you do not need to open the spec to execute.

**Conventions used throughout:**
- All internal links/assets use Liquid `relative_url` (harmless with empty `baseurl`, future-proof).
- Run all commands from the repo root: `/Users/matt/git/skill-patterns`.
- Owner placeholder: the GitHub repo URL is assumed to be `https://github.com/borkweb/skill-patterns`. If the owner differs, change `repo_url` in `_config.yml` (Task 2) — it is referenced only there.

---

## File structure (created by this plan)

```
/
├── .gitignore                 # add _site/, .jekyll-cache/, vendor/  (Task 1)
├── Gemfile                    # github-pages gem                      (Task 1)
├── _config.yml                # site config, collection, excludes     (Task 1 → 2)
├── CNAME                      # skillpatterns.ai                     (Task 9)
├── index.html                 # home page (layout: home) + intro      (Task 3)
├── resources.md               # resources page (layout: page)         (Task 8)
├── _data/
│   └── categories.yml         # 5 categories                          (Task 3)
├── _patterns/                 # 14 Markdown files (output: false)     (Task 3 → 4)
├── _layouts/
│   ├── default.html           # html shell                            (Task 2)
│   ├── home.html              # sidebar + content + pattern loop      (Task 3)
│   └── page.html              # simple centered page                  (Task 8)
├── _includes/
│   ├── head.html              # meta + no-flash theme script + CSS    (Task 2)
│   ├── header.html            # brand, nav, theme toggle              (Task 2)
│   ├── footer.html            # credit, license, repo link            (Task 2)
│   ├── sidebar.html           # search + category nav                 (Task 3)
│   └── pattern.html           # one rendered pattern block            (Task 3)
└── assets/
    ├── css/style.css          # tokens + themes + layout + components (Task 5)
    └── js/app.js              # theme, search, scroll-spy, copy       (Task 6)
```

---

## Task 1: Branch + Jekyll scaffold + build green

**Files:**
- Create: `Gemfile`
- Create: `_config.yml`
- Create: `.gitignore` (append)
- Create: `index.html` (temporary minimal page; replaced in Task 3)

- [ ] **Step 1: Create the feature branch**

We are on `main` (default). Branch first.

Run:
```bash
cd /Users/matt/git/skill-patterns
git checkout -b skill-patterns-site
```

- [ ] **Step 2: Add ignore entries**

Append to `.gitignore` (it already contains `.superpowers/`):
```
_site/
.jekyll-cache/
vendor/
Gemfile.lock
```

- [ ] **Step 3: Create the `Gemfile`**

`Gemfile`:
```ruby
source "https://rubygems.org"

# Pin to GitHub Pages' Jekyll toolchain so local builds match production.
gem "github-pages", group: :jekyll_plugins

# Faraday/webrick shims sometimes needed on modern Ruby for `jekyll serve`.
gem "webrick", "~> 1.8"
```

- [ ] **Step 4: Create a minimal `_config.yml`**

`_config.yml`:
```yaml
title: "Skill Patterns"
description: "A catalog of reusable patterns for composing AI Skills."
url: "https://skillpatterns.ai"
baseurl: ""
repo_url: "https://github.com/borkweb/skill-patterns"

collections:
  patterns:
    output: false

markdown: kramdown

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - LICENSE
  - docs/
  - .superpowers/
  - vendor/
  - "*.pdf"
```

- [ ] **Step 5: Create a temporary `index.html` so the build has a page**

`index.html`:
```html
---
title: Skill Patterns
---
<h1>Skill Patterns (scaffold)</h1>
```

- [ ] **Step 6: Install gems (failing build check first)**

Run:
```bash
cd /Users/matt/git/skill-patterns
bundle install
```
Expected: resolves and installs `github-pages`. If `bundle` is missing: `gem install bundler` first. If Ruby is too old for the gem, install a current Ruby (e.g. via `rbenv`/`asdf`) and retry.

- [ ] **Step 7: Build and verify output exists**

Run:
```bash
bundle exec jekyll build
test -f _site/index.html && echo "BUILD_OK"
```
Expected: prints `BUILD_OK` (the build wrote `_site/index.html`).

- [ ] **Step 8: Commit**

```bash
git add .gitignore Gemfile _config.yml index.html
git commit -m "chore: scaffold Jekyll site (github-pages, base config)"
```

---

## Task 2: Base layout, head (no-flash theme), header, footer

**Files:**
- Create: `_layouts/default.html`
- Create: `_includes/head.html`
- Create: `_includes/header.html`
- Create: `_includes/footer.html`
- Modify: `index.html` (use `layout: default`)

- [ ] **Step 1: Create `_includes/head.html`**

The inline script sets the theme before first paint to avoid a flash of the wrong theme. CSS is referenced now even though `style.css` arrives in Task 5 (a 404 for CSS does not break the build or these tasks' assertions).

`_includes/head.html`:
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{% if page.title and page.title != site.title %}{{ page.title }} · {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
<meta name="description" content="{{ page.description | default: site.description }}">
<link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 2: Create `_includes/header.html`**

`_includes/header.html`:
```html
<header class="site-header">
  <a class="brand" href="{{ '/' | relative_url }}">Skill<span>Patterns</span></a>
  <nav class="header-nav" aria-label="Primary">
    <a href="{{ '/resources/' | relative_url }}">Resources</a>
    <a href="{{ site.repo_url }}" rel="noopener">GitHub</a>
    <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle dark mode">
      <span class="theme-toggle__icon" aria-hidden="true"></span>
    </button>
  </nav>
</header>
```

- [ ] **Step 3: Create `_includes/footer.html`**

`_includes/footer.html`:
```html
<footer class="site-footer">
  <p>Reusable patterns for composing AI Skills.</p>
  <p><a href="{{ site.repo_url }}" rel="noopener">Source on GitHub</a> · MIT License</p>
</footer>
```

- [ ] **Step 4: Create `_layouts/default.html`**

`_layouts/default.html`:
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  {%- include head.html -%}
</head>
<body>
  {%- include header.html -%}
  {{ content }}
  {%- include footer.html -%}
  <script src="{{ '/assets/js/app.js' | relative_url }}" defer></script>
</body>
</html>
```

- [ ] **Step 5: Point `index.html` at the layout**

Replace `index.html` with:
```html
---
layout: default
title: Skill Patterns
---
<h1>Skill Patterns (scaffold)</h1>
```

- [ ] **Step 6: Build and assert header/footer/theme hooks render**

Run:
```bash
bundle exec jekyll build
grep -q 'id="theme-toggle"' _site/index.html && \
grep -q 'class="brand"' _site/index.html && \
grep -q 'site-footer' _site/index.html && \
grep -q "getAttribute('data-theme'" _site/index.html && \
echo "LAYOUT_OK"
```
Expected: prints `LAYOUT_OK`.

- [ ] **Step 7: Commit**

```bash
git add _layouts/default.html _includes/head.html _includes/header.html _includes/footer.html index.html
git commit -m "feat: base layout with header, footer, and no-flash theme script"
```

---

## Task 3: Categories data, sidebar, pattern include, home layout, first pattern

**Files:**
- Create: `_data/categories.yml`
- Create: `_includes/sidebar.html`
- Create: `_includes/pattern.html`
- Create: `_layouts/home.html`
- Create: `_patterns/trusted-sources.md`
- Modify: `index.html` (use `layout: home`, add intro)

- [ ] **Step 1: Create `_data/categories.yml`**

`_data/categories.yml`:
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

- [ ] **Step 2: Create `_includes/sidebar.html`**

`_includes/sidebar.html`:
```html
<aside class="sidebar" id="sidebar">
  <div class="search">
    <input type="search" id="pattern-search" placeholder="Search patterns…" aria-label="Search patterns" autocomplete="off">
  </div>
  <nav class="sidebar-nav" aria-label="Patterns">
    {% assign cats = site.data.categories | sort: "order" %}
    {% for cat in cats %}
      <div class="sidebar-cat" data-cat="{{ cat.key }}">
        <h2 class="sidebar-cat__title">{{ cat.title }}</h2>
        <ul>
          {% assign pats = site.patterns | where: "category", cat.key | sort: "order" %}
          {% for p in pats %}
            <li><a href="#{{ p.slug }}" data-link="{{ p.slug }}">{{ p.title }}</a></li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </nav>
</aside>
```

- [ ] **Step 3: Create `_includes/pattern.html`**

`_includes/pattern.html`:
```html
{% assign p = include.pattern %}
<article class="pattern" id="{{ p.slug }}" data-cat="{{ p.category }}">
  <h3 class="pattern__title">{{ p.title }}</h3>
  <p class="pattern__summary">{{ p.summary }}</p>
  <h4 class="pattern__adds-label">What it adds</h4>
  <ul class="pattern__adds">
    {% for item in p.adds %}<li>{{ item }}</li>{% endfor %}
  </ul>
  <div class="prompt">
    <div class="prompt__head">
      <span class="prompt__label">Example prompt partial</span>
      <button class="prompt__copy" type="button" data-copy="{{ p.slug }}">Copy</button>
    </div>
    <pre class="prompt__body" id="prompt-{{ p.slug }}">{{ p.prompt }}</pre>
  </div>
</article>
```

- [ ] **Step 4: Create `_layouts/home.html`**

`_layouts/home.html`:
```html
---
layout: default
---
<div class="layout">
  {%- include sidebar.html -%}
  <main class="content" id="content">
    {{ content }}
    {% assign cats = site.data.categories | sort: "order" %}
    {% for cat in cats %}
      <section class="cat-section" id="cat-{{ cat.key }}" data-cat="{{ cat.key }}">
        <h2 class="cat-section__title">{{ cat.title }}</h2>
        <p class="cat-section__desc">{{ cat.description }}</p>
        {% assign pats = site.patterns | where: "category", cat.key | sort: "order" %}
        {% for p in pats %}
          {% include pattern.html pattern=p %}
        {% endfor %}
      </section>
    {% endfor %}
  </main>
</div>
```

- [ ] **Step 5: Create the first pattern `_patterns/trusted-sources.md`**

`_patterns/trusted-sources.md`:
```markdown
---
title: "Trusted sources / grounding"
slug: trusted-sources
category: grounding
order: 1
summary: "Anchors the agent in specific authoritative references so it stops improvising from training data."
adds:
  - "Cites which source supports each claim"
  - "Defers to specified sources when they conflict with general knowledge"
  - "Flags gaps instead of filling them silently"
prompt: |
  Ground this Skill in the following authoritative sources: [URLs / paths / docs]. When the task touches this area, consult these first. If your training contradicts these sources, the sources win. Cite which source each claim comes from. If a source is missing or ambiguous, flag the gap rather than filling it from prior knowledge.
---
```

- [ ] **Step 6: Replace `index.html` with the real home page**

`index.html`:
```html
---
layout: home
title: Skill Patterns
---
<section class="intro">
  <h1>Skill patterns</h1>
  <p>Reusable techniques you can drop into a Skill to bake in specific behaviors — grounding an agent in trusted sources, pausing for a human, stress-testing its own work, shaping its output, and more.</p>
  <p>Each pattern below has a short definition, what it adds, and an example prompt partial you can copy straight into your own Skill. Search to filter, or jump around from the sidebar.</p>
</section>
```

- [ ] **Step 7: Build and assert the first pattern renders**

Run:
```bash
bundle exec jekyll build
grep -q 'id="trusted-sources"' _site/index.html && \
grep -q 'Grounding &amp; accuracy' _site/index.html && \
grep -q 'data-copy="trusted-sources"' _site/index.html && \
grep -q 'id="prompt-trusted-sources"' _site/index.html && \
grep -q 'href="#trusted-sources"' _site/index.html && \
echo "PATTERN_OK"
```
Expected: prints `PATTERN_OK` (pattern block, category header, copy button, prompt body, and sidebar link all present).

- [ ] **Step 8: Commit**

```bash
git add _data/categories.yml _includes/sidebar.html _includes/pattern.html _layouts/home.html _patterns/trusted-sources.md index.html
git commit -m "feat: home layout with sidebar, category grouping, and first pattern"
```

---

## Task 4: Add the remaining 13 patterns

**Files:**
- Create: `_patterns/exemplars-over-instruction.md`, `_patterns/confidence-calibration.md`, `_patterns/encoded-reasoning.md`, `_patterns/self-critique.md`, `_patterns/adversarial-push-back.md`, `_patterns/premortem.md`, `_patterns/bounded-option-generation.md`, `_patterns/decision-capture.md`, `_patterns/format-projection.md`, `_patterns/artifact-creation.md`, `_patterns/human-in-the-loop.md`, `_patterns/role-priming.md`, `_patterns/workflows-as-superset.md`

- [ ] **Step 1: Create the Grounding & accuracy patterns**

`_patterns/exemplars-over-instruction.md`:
```markdown
---
title: "Exemplars over instruction"
slug: exemplars-over-instruction
category: grounding
order: 2
summary: "Anchors the Skill's output in concrete examples of \"good\" rather than describing it in rules."
adds:
  - "Matches the shape, voice, and structure of provided examples"
  - "Surfaces which exemplar it drew from when the choice is ambiguous"
  - "Asks for a new exemplar when the work falls outside the set"
prompt: |
  Here are exemplars of [strong outputs / preferred voice / target format]: [paste 2-4 examples]. Match the shape and voice of these rather than following rules I might write down. When the task falls outside what the exemplars cover, say so and ask for a new exemplar instead of guessing. Cite which exemplar most influenced the output.
---
```

`_patterns/confidence-calibration.md`:
```markdown
---
title: "Confidence calibration"
slug: confidence-calibration
category: grounding
order: 3
summary: "Requires the agent to mark which parts of its output it's confident about and which are guesses."
adds:
  - "Tags claims by certainty so high-risk pieces are visible at a glance"
  - "Distinguishes what's verified against sources from what's inferred or assumed"
  - "Tells you where to spend your verification time and where you can move fast"
prompt: |
  As you produce [output], mark each substantive claim with a confidence level: high (verified against a source or directly observable), medium (inferred from pattern or adjacent evidence), low (filling a gap, best guess, please verify). For low-confidence claims, briefly note what would raise the confidence — a source to check, a test to run, a person to ask. Don't smooth out uncertainty in the final wording; if it's a guess, it should read like one.
---
```

- [ ] **Step 2: Create the Critique & stress-testing patterns**

`_patterns/encoded-reasoning.md`:
```markdown
---
title: "Encoded reasoning"
slug: encoded-reasoning
category: critique
order: 1
summary: "Bakes review rubrics, validation steps, and quality checks into how the Skill operates."
adds:
  - "Runs outputs against a defined rubric before returning them"
  - "Surfaces which criteria passed, failed, or are uncertain"
  - "Catches predictable failure modes the team has seen before"
prompt: |
  Before returning output, check the work against these criteria: [rubric items]. Report which criteria passed, failed, or are uncertain. Don't return work that fails [hard criteria] — revise and retry. Surface the rubric results alongside the output so I can see the reasoning.
---
```

`_patterns/self-critique.md`:
```markdown
---
title: "Self-critique"
slug: self-critique
category: critique
order: 2
summary: "Has the agent review its own output against criteria, identify weaknesses, and revise before returning."
adds:
  - "Produces a first draft, then critiques it against the brief"
  - "Names the weakest reasoning and the most fragile assumption"
  - "Returns the revised output with a note on what changed and why"
prompt: |
  After producing [output], step back and critique your own work against [criteria: the original brief, the rubric, what a strong reviewer would notice]. Identify the weakest reasoning, the most fragile assumption, and the part most likely to be wrong. Revise. Return the revised output along with a brief note on what changed and why.
---
```

`_patterns/adversarial-push-back.md`:
```markdown
---
title: "Adversarial push back"
slug: adversarial-push-back
category: critique
order: 3
summary: "Pits a challenger persona or parallel agent against the work to expose weaknesses before it ships."
adds:
  - "Argues the strongest case against the proposal, with reasoning"
  - "Surfaces assumptions that wouldn't survive scrutiny"
  - "Forces defense of choices instead of quiet acceptance"
prompt: |
  Before finalizing [output], take the role of [adversary: skeptical reviewer, hostile architect, opposing counsel, competitor's CTO]. Argue the strongest case against the proposal. Identify the assumptions most likely to fail, the evidence that's missing, and the decisions that would look wrong in hindsight. Return the pushback and the original work side by side.
---
```

`_patterns/premortem.md`:
```markdown
---
title: "Premortem"
slug: premortem
category: critique
order: 4
summary: "Skill imagines the work has already failed and reasons backward to why."
adds:
  - "Generates the most plausible failure stories before the work ships"
  - "Surfaces risks that wouldn't appear in a forward-looking review"
  - "Names which current assumptions, if wrong, cause the failure"
prompt: |
  Before finalizing [the plan / the decision / the proposal], run a premortem. Imagine it's [6 months / a year / one quarter] from now and this work has clearly failed. Generate the 3 most plausible failure stories — what went wrong, in what order, and why it wasn't caught in time. For each, name the assumption in the current plan that, if wrong, made the failure inevitable. Return the failure stories alongside the original work, with the riskiest assumptions called out.
---
```

- [ ] **Step 3: Create the Decision-making patterns**

`_patterns/bounded-option-generation.md`:
```markdown
---
title: "Bounded option generation"
slug: bounded-option-generation
category: decision
order: 1
summary: "Forces a fixed number of distinct alternatives with trade-offs before converging on a recommendation."
adds:
  - "Generates options that are genuinely different, not variations"
  - "Names what each option optimizes for and what it gives up"
  - "Recommends one, addressing why not the others"
prompt: |
  Before recommending [a decision / an approach], generate [3] meaningfully different options. Each must take a different bet — not variations of the same shape. For each, name what it's optimizing for and what it's giving up. Then recommend one, including why the other options were rejected rather than only why this one wins.
---
```

`_patterns/decision-capture.md`:
```markdown
---
title: "Decision capture"
slug: decision-capture
category: decision
order: 2
summary: "Surfaces the assumptions, alternatives considered, and reasoning trail alongside the output so the decision is auditable."
adds:
  - "Records what was assumed and what was uncertain"
  - "Lists alternatives considered and why they were rejected"
  - "Writes the reasoning trail for a reader who wasn't in the room"
prompt: |
  Alongside [the output / the recommendation], capture: the assumptions you made, the alternatives you considered, the reasoning that led to this choice, and the conditions under which you'd revisit it. Write it for a reader who wasn't in the room. Keep it short — enough that someone three months from now can tell whether the decision still holds.
---
```

- [ ] **Step 4: Create the Output shaping patterns**

`_patterns/format-projection.md`:
```markdown
---
title: "Format projection"
slug: format-projection
category: output
order: 1
summary: "Renders one canonical artifact into multiple downstream forms while preserving the underlying content."
adds:
  - "Produces the source artifact once, then derives variants from it"
  - "Each variant matches its channel's conventions (length, tone, format)"
  - "Surfaces what was cut or compressed in each derivation"
prompt: |
  Produce the canonical [artifact: decision doc, spec, research summary] first. Then derive these variants from it: [list: P2 post, Slack summary, exec brief, email update]. Each variant should match the conventions of its channel. Don't re-reason — derive. Note what was cut or compressed in each variant so I can spot if something important got lost.
---
```

`_patterns/artifact-creation.md`:
```markdown
---
title: "Artifact creation"
slug: artifact-creation
category: output
order: 2
summary: "Directs the Skill to produce a concrete, standalone deliverable rather than a conversational response."
adds:
  - "Returns a finished artifact (doc, deck outline, spec, mockup, dataset) you can lift out and use"
  - "Matches a defined structure or template so the output is predictable"
  - "Separates the artifact from the surrounding chatter — you know what to keep"
prompt: |
  Produce a standalone [artifact type: brief, spec, one-pager, dashboard outline, draft P2 post] rather than answering conversationally. Follow this structure: [sections / template / required fields]. Return the artifact as a self-contained block I can copy out. Keep commentary about the artifact separate from the artifact itself — if you need to flag assumptions or open questions, put them after, not inside.
---
```

- [ ] **Step 5: Create the Control & composition patterns**

`_patterns/human-in-the-loop.md`:
```markdown
---
title: "Human in the loop"
slug: human-in-the-loop
category: control
order: 1
summary: "Inserts explicit checkpoints where the agent pauses for discernment before proceeding."
adds:
  - "Stops before destructive, irreversible, or high-stakes steps"
  - "Surfaces what it's about to do and waits for confirmation"
  - "Distinguishes routine steps (proceed) from judgment calls (pause)"
prompt: |
  Before [specific actions: deploying, sending, deleting, committing, finalizing], pause and summarize what you're about to do and why. Wait for my confirmation, redirect, or override before proceeding. Routine steps can run without checkpoints; judgment calls always pause. [When presenting me with options, allow me to keep the default, give me two more, and let me enter my own.]
---
```

`_patterns/role-priming.md`:
```markdown
---
title: "Role priming"
slug: role-priming
category: control
order: 2
summary: "Puts the agent in a specific stance for the duration of the Skill so its reasoning carries that perspective."
adds:
  - "Approaches the work from the named role's priorities and constraints"
  - "Uses the vocabulary and reference points of that role"
  - "Stays in role across follow-ups within the same task"
prompt: |
  Approach this work as [role: staff engineer reviewing a PR, finance partner reviewing a forecast, support lead reviewing a flow]. Use the priorities, vocabulary, and constraints that role brings. Stay in role across follow-up questions within this task. If you'd break role to be more helpful, say so and ask before switching.
---
```

`_patterns/workflows-as-superset.md`:
```markdown
---
title: "Workflows as superset"
slug: workflows-as-superset
category: control
order: 3
summary: "Composes this Skill with others into a sequenced flow."
adds:
  - "Triggers other Skills in a defined order"
  - "Passes outputs from one stage as inputs to the next"
  - "Surfaces workflow state so you can see where you are in the chain"
prompt: |
  Run this as a workflow: [Skill 1] → [Skill 2] → [Skill 3]. Pass the output of each stage as input to the next. After each stage, summarize what was produced and confirm before moving on. If a stage fails its checks, stop and surface the issue rather than continuing.
---
```

- [ ] **Step 6: Build and assert all 14 patterns render, grouped, with matching sidebar links**

Run:
```bash
bundle exec jekyll build
echo "patterns: $(grep -c 'class="pattern"' _site/index.html) (want 14)"
echo "sections: $(grep -c 'class="cat-section"' _site/index.html) (want 5)"
echo "copy btns: $(grep -c 'class="prompt__copy"' _site/index.html) (want 14)"
echo "nav links: $(grep -c 'data-link=' _site/index.html) (want 14)"
```
Expected: `patterns: 14`, `sections: 5`, `copy btns: 14`, `nav links: 14`.

- [ ] **Step 7: Assert each slug has both a content anchor and a sidebar link**

Run:
```bash
for slug in trusted-sources exemplars-over-instruction confidence-calibration encoded-reasoning self-critique adversarial-push-back premortem bounded-option-generation decision-capture format-projection artifact-creation human-in-the-loop role-priming workflows-as-superset; do
  grep -q "id=\"$slug\"" _site/index.html && grep -q "href=\"#$slug\"" _site/index.html || echo "MISSING: $slug";
done; echo "SLUG_CHECK_DONE"
```
Expected: prints only `SLUG_CHECK_DONE` (no `MISSING:` lines).

- [ ] **Step 8: Commit**

```bash
git add _patterns/
git commit -m "feat: add remaining 13 patterns across all five categories"
```

---

## Task 5: Stylesheet (tokens, light/dark themes, layout, components)

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Create `assets/css/style.css`**

`assets/css/style.css`:
```css
:root {
  --bg: #ffffff;
  --bg-elevated: #f7f8fa;
  --border: #e7e9ee;
  --border-strong: #dfe2e8;
  --text: #0b1020;
  --text-muted: #4b5263;
  --text-faint: #8a90a0;
  --accent: #3858E9;
  --accent-contrast: #ffffff;
  --prompt-bg: #fdf6dd;
  --prompt-bg-head: #fbf0c9;
  --prompt-border: #f0e4b0;
  --prompt-label: #7a6a1f;
  --prompt-text: #4a431f;
  --radius: 10px;
  --sidebar-w: 264px;
  --content-max: 720px;
  --header-h: 57px;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
[data-theme="dark"] {
  --bg: #0f1115;
  --bg-elevated: #14161c;
  --border: #23262f;
  --border-strong: #2a2e38;
  --text: #f1f3f8;
  --text-muted: #a9b0be;
  --text-faint: #6b7280;
  --accent: #6b8aff;
  --accent-contrast: #0b1020;
  --prompt-bg: #211d10;
  --prompt-bg-head: #2a2412;
  --prompt-border: #463d1d;
  --prompt-label: #d9c373;
  --prompt-text: #e8dcae;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 72px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { margin: 0; font-family: var(--sans); color: var(--text); background: var(--bg); line-height: 1.5; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Header */
.site-header {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  height: var(--header-h); padding: 0 24px; background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.brand { font-weight: 800; font-size: 18px; color: var(--text); letter-spacing: -.01em; }
.brand span { color: var(--accent); }
.header-nav { display: flex; align-items: center; gap: 18px; }
.header-nav a { color: var(--text-muted); font-size: 14px; font-weight: 500; }
.theme-toggle {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border-strong);
  background: var(--bg-elevated); cursor: pointer; display: grid; place-items: center; padding: 0;
}
.theme-toggle__icon::before { content: "🌙"; font-size: 15px; }
[data-theme="dark"] .theme-toggle__icon::before { content: "☀️"; }

/* Layout */
.layout { display: flex; align-items: flex-start; max-width: 1120px; margin: 0 auto; }
.sidebar {
  position: sticky; top: var(--header-h); align-self: flex-start;
  width: var(--sidebar-w); flex: 0 0 var(--sidebar-w);
  height: calc(100vh - var(--header-h)); overflow-y: auto;
  padding: 22px 16px; border-right: 1px solid var(--border);
}
.search input {
  width: 100%; padding: 8px 12px; font-size: 14px; font-family: var(--sans);
  border: 1px solid var(--border-strong); border-radius: 8px;
  background: var(--bg); color: var(--text);
}
.sidebar-cat { margin-top: 18px; }
.sidebar-cat__title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-faint); margin: 0 0 6px; }
.sidebar-cat ul { list-style: none; margin: 0; padding: 0; }
.sidebar-cat a { display: block; padding: 4px 10px; font-size: 13.5px; color: var(--text-muted); border-radius: 6px; }
.sidebar-cat a:hover { text-decoration: none; background: var(--bg-elevated); }
.sidebar-cat a.is-active { background: var(--accent); color: var(--accent-contrast); font-weight: 600; }
.sidebar-cat a.is-active:hover { background: var(--accent); }

/* Content */
.content { flex: 1 1 auto; min-width: 0; padding: 32px 40px; }
.intro { margin-bottom: 8px; }
.intro h1 { font-size: 34px; font-weight: 800; letter-spacing: -.02em; margin: 0 0 12px; }
.intro p { color: var(--text-muted); max-width: var(--content-max); font-size: 16px; margin: 0 0 10px; }

.cat-section { padding-top: 26px; }
.cat-section__title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); margin: 0 0 2px; }
.cat-section__desc { color: var(--text-faint); margin: 0 0 8px; font-size: 14px; }

.pattern { padding: 22px 0; border-top: 1px solid var(--border); max-width: var(--content-max); }
.pattern__title { font-size: 22px; font-weight: 800; letter-spacing: -.01em; margin: 0 0 6px; }
.pattern__summary { color: var(--text-muted); margin: 0 0 14px; }
.pattern__adds-label { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--text); margin: 0 0 8px; }
.pattern__adds { list-style: none; margin: 0 0 16px; padding: 0; }
.pattern__adds li { position: relative; padding: 4px 0 4px 22px; color: var(--text-muted); }
.pattern__adds li::before { content: "+"; position: absolute; left: 0; color: var(--accent); font-weight: 800; }

.prompt { border: 1px solid var(--prompt-border); border-radius: var(--radius); overflow: hidden; background: var(--prompt-bg); }
.prompt__head { display: flex; justify-content: space-between; align-items: center; padding: 9px 14px; background: var(--prompt-bg-head); border-bottom: 1px solid var(--prompt-border); }
.prompt__label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--prompt-label); }
.prompt__copy { background: var(--accent); color: var(--accent-contrast); border: none; border-radius: 6px; font-size: 12px; font-weight: 600; padding: 5px 12px; cursor: pointer; }
.prompt__copy:hover { filter: brightness(1.05); }
.prompt__copy.is-copied { background: #2c9c4a; color: #fff; }
.prompt__body { margin: 0; padding: 14px; font-family: var(--mono); font-size: 13px; line-height: 1.6; color: var(--prompt-text); white-space: pre-wrap; word-break: break-word; }

.is-hidden { display: none !important; }

/* Resources / simple pages */
.page { max-width: var(--content-max); margin: 0 auto; padding: 40px 24px; }
.page h1 { font-size: 30px; font-weight: 800; letter-spacing: -.02em; }
.page h2 { margin-top: 28px; font-size: 15px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-faint); }
.page ul { padding-left: 18px; }
.page li { margin: 8px 0; color: var(--text-muted); }

/* Footer */
.site-footer { border-top: 1px solid var(--border); padding: 28px 24px; text-align: center; color: var(--text-faint); font-size: 13px; }
.site-footer p { margin: 4px 0; }
.site-footer a { color: var(--text-muted); }

/* Responsive */
@media (max-width: 820px) {
  .layout { flex-direction: column; }
  .sidebar { position: static; width: 100%; height: auto; flex-basis: auto; border-right: none; border-bottom: 1px solid var(--border); }
  .content { padding: 24px 20px; }
}
```

- [ ] **Step 2: Build and assert the stylesheet is present and themed**

Run:
```bash
bundle exec jekyll build
test -f _site/assets/css/style.css && \
grep -q '\[data-theme="dark"\]' _site/assets/css/style.css && \
grep -q '.prompt__copy' _site/assets/css/style.css && \
echo "CSS_OK"
```
Expected: prints `CSS_OK`.

- [ ] **Step 3: Visually verify both themes (Playwright)**

Start a local server (leave it running for Tasks 5–6):
```bash
bundle exec jekyll serve --detach --port 4000
```
Then use the Playwright MCP browser tools:
1. `browser_navigate` → `http://localhost:4000/`
2. `browser_take_screenshot` (light theme) — confirm: sticky header with brand + toggle, left sidebar with categories/patterns, content with category sections and amber prompt panels.
3. `browser_evaluate` → `() => { localStorage.setItem('theme','dark'); document.documentElement.setAttribute('data-theme','dark'); return document.documentElement.getAttribute('data-theme'); }` → expect `"dark"`
4. `browser_take_screenshot` (dark theme) — confirm dark surfaces, brighter blue accent, dark amber prompt panels.

Manual fallback (if Playwright is unavailable): open `http://localhost:4000/` in a browser, confirm the light layout, then run `localStorage.setItem('theme','dark')` in the console and reload to confirm dark mode.

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: stylesheet with light/dark themes, layout, and prompt component"
```

---

## Task 6: Interactivity — theme toggle, search, scroll-spy, copy (app.js)

**Files:**
- Create: `assets/js/app.js`

Ensure the dev server from Task 5 is still running (`bundle exec jekyll serve --detach --port 4000`); `jekyll serve` rebuilds on file changes, so after each step reload the page in Playwright to pick up changes.

- [ ] **Step 1: Create `assets/js/app.js` with all four behaviors**

`assets/js/app.js`:
```javascript
(function () {
  'use strict';

  /* Theme toggle */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Search filter */
  var search = document.getElementById('pattern-search');
  var patterns = Array.prototype.slice.call(document.querySelectorAll('.pattern'));
  var catSections = Array.prototype.slice.call(document.querySelectorAll('.cat-section'));
  var sidebarCats = Array.prototype.slice.call(document.querySelectorAll('.sidebar-cat'));

  function applyFilter(q) {
    q = (q || '').trim().toLowerCase();
    var visibleByCat = {};
    patterns.forEach(function (el) {
      var match = q === '' || el.textContent.toLowerCase().indexOf(q) !== -1;
      el.classList.toggle('is-hidden', !match);
      if (match) { visibleByCat[el.getAttribute('data-cat')] = true; }
    });
    catSections.forEach(function (sec) {
      sec.classList.toggle('is-hidden', !visibleByCat[sec.getAttribute('data-cat')]);
    });
    sidebarCats.forEach(function (sc) {
      var cat = sc.getAttribute('data-cat');
      sc.classList.toggle('is-hidden', !visibleByCat[cat]);
      Array.prototype.forEach.call(sc.querySelectorAll('a[data-link]'), function (a) {
        var pat = document.getElementById(a.getAttribute('data-link'));
        var matched = pat && !pat.classList.contains('is-hidden');
        a.parentNode.classList.toggle('is-hidden', !matched);
      });
    });
  }

  if (search) {
    search.addEventListener('input', function () { applyFilter(search.value); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== search) {
      e.preventDefault();
      if (search) search.focus();
    } else if (e.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      applyFilter('');
    }
  });

  /* Scroll-spy: highlight the active pattern's sidebar link */
  var navLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll('.sidebar-cat a[data-link]'), function (a) {
    navLinks[a.getAttribute('data-link')] = a;
  });
  if ('IntersectionObserver' in window && patterns.length) {
    var currentId = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (currentId && navLinks[currentId]) navLinks[currentId].classList.remove('is-active');
          currentId = entry.target.id;
          if (navLinks[currentId]) navLinks[currentId].classList.add('is-active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    patterns.forEach(function (p) { observer.observe(p); });
  }

  /* Copy buttons */
  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    cb();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.prompt__copy'), function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById('prompt-' + btn.getAttribute('data-copy'));
      if (!pre) return;
      var text = pre.textContent;
      var done = function () {
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('is-copied');
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
})();
```

- [ ] **Step 2: Build and assert the script is present**

Run:
```bash
bundle exec jekyll build
test -f _site/assets/js/app.js && \
grep -q 'IntersectionObserver' _site/assets/js/app.js && \
grep -q 'writeText' _site/assets/js/app.js && \
echo "JS_OK"
```
Expected: prints `JS_OK`.

- [ ] **Step 3: Verify theme toggle (Playwright)**

With the server running, use Playwright MCP:
1. `browser_navigate` → `http://localhost:4000/`
2. `browser_evaluate` → `() => document.documentElement.getAttribute('data-theme')` → note value (e.g. `"light"`)
3. `browser_click` the theme toggle (ref the `#theme-toggle` button from a `browser_snapshot`)
4. `browser_evaluate` → `() => document.documentElement.getAttribute('data-theme')` → expect the opposite value
5. `browser_evaluate` → `() => localStorage.getItem('theme')` → expect it to match step 4 (persisted)

- [ ] **Step 4: Verify search filtering (Playwright)**

1. `browser_navigate` → `http://localhost:4000/` (fresh load)
2. `browser_type` into `#pattern-search` the text `premortem`
3. `browser_evaluate` → `() => document.querySelectorAll('.pattern:not(.is-hidden)').length` → expect `1`
4. `browser_evaluate` → `() => document.querySelectorAll('.cat-section:not(.is-hidden)').length` → expect `1` (only "Critique & stress-testing" remains)
5. `browser_evaluate` → clear and restore: `() => { var s=document.getElementById('pattern-search'); s.value=''; s.dispatchEvent(new Event('input')); return document.querySelectorAll('.pattern:not(.is-hidden)').length; }` → expect `14`

- [ ] **Step 5: Verify copy button (Playwright)**

1. `browser_navigate` → `http://localhost:4000/`
2. `browser_evaluate` to grant clipboard read for assertion is unreliable across browsers; instead assert the button feedback and the source text:
   - `browser_click` the first `.prompt__copy` button (ref from `browser_snapshot`)
   - `browser_evaluate` → `() => document.querySelector('.prompt__copy').textContent` → expect `"Copied!"`
   - `browser_evaluate` → `() => document.getElementById('prompt-trusted-sources').textContent.slice(0,16)` → expect it begins with `"Ground this Skil"`

Manual fallback: load the page, click a Copy button, confirm it flips to "Copied!" then back, and paste into a text field to confirm the prompt text copied.

- [ ] **Step 6: Verify scroll-spy (Playwright)**

1. `browser_navigate` → `http://localhost:4000/#premortem`
2. `browser_evaluate` → `() => { window.scrollBy(0, 1); return true; }` (nudge to trigger the observer)
3. `browser_evaluate` → `() => { var a=document.querySelector('.sidebar-cat a.is-active'); return a ? a.getAttribute('data-link') : null; }` → expect a non-null slug (the active link tracks the visible pattern)

- [ ] **Step 7: Stop the dev server**

Run:
```bash
pkill -f "jekyll serve" || true
```

- [ ] **Step 8: Commit**

```bash
git add assets/js/app.js
git commit -m "feat: search, scroll-spy, copy buttons, and theme toggle"
```

---

## Task 7: Resources page

**Files:**
- Create: `_layouts/page.html`
- Create: `resources.md`

- [ ] **Step 1: Create `_layouts/page.html`**

`_layouts/page.html`:
```html
---
layout: default
---
<main class="page">
  {{ content }}
</main>
```

- [ ] **Step 2: Create `resources.md`**

`resources.md`:
```markdown
---
layout: page
title: Resources
description: Links and reference skills for building AI Skills.
---

# Resources

A short, curated set of places to learn more and skills worth studying.

## Learn & explore

- [Agent Skills open standard](https://agentskills.io)
- [Anthropic Skills repo](https://github.com/anthropics/skills)
- [Claude Code / Skills docs](https://docs.anthropic.com/en/docs/claude-code)
- [Equipping agents for the real world with agent skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [skills.sh — the open agent skills ecosystem](https://skills.sh) — searchable, with ratings. Try `npx skills find <query>`.
- [WordPress agent skills](https://github.com/WordPress/agent-skills)
- [Automattic design skills](https://github.com/Automattic/design-skills)

## Reference skills to study

Single-purpose skills and plugins that show the patterns in action:

- **caveman** — ultra-compressed communication mode
- **council** — structured adversarial assessment with a verdict
- **grill-with-docs** — interview-style plan challenge against your domain model
- **humanize** — detects and removes AI writing patterns
- **prototype** — scaffolds a throwaway frontend or backend prototype
- **red-pen** — strict editorial review (Orwell's rules + Practical Typography)
- **voiceprint** — extracts a linguistic fingerprint into a writer skill
- **frontend-designer** — distinctive, production-grade frontend interfaces
- **last30days** — research a topic across Reddit, X, YouTube, HN, and more
- **superpowers** — core skills library for Claude Code (TDD, debugging, collaboration)
```

- [ ] **Step 3: Build and assert the Resources page renders**

Run:
```bash
bundle exec jekyll build
test -f _site/resources/index.html && \
grep -q 'agentskills.io' _site/resources/index.html && \
grep -q 'class="page"' _site/resources/index.html && \
grep -q 'Reference skills to study' _site/resources/index.html && \
echo "RESOURCES_OK"
```
Expected: prints `RESOURCES_OK`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/page.html resources.md
git commit -m "feat: resources page with links and reference skills"
```

---

## Task 8: Custom domain (CNAME) + production URL config

**Files:**
- Create: `CNAME`

- [ ] **Step 1: Create the `CNAME` file**

`CNAME` (exact contents, single line, no trailing path):
```
skillpatterns.ai
```

- [ ] **Step 2: Build and assert CNAME is published to the site root**

Run:
```bash
bundle exec jekyll build
test -f _site/CNAME && grep -qx 'skillpatterns.ai' _site/CNAME && echo "CNAME_OK"
```
Expected: prints `CNAME_OK`.

- [ ] **Step 3: Commit**

```bash
git add CNAME
git commit -m "chore: configure custom apex domain skillpatterns.ai"
```

---

## Task 9: README (local dev, adding patterns, deploy + DNS) and final smoke

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

`README.md`:
```markdown
# Skill Patterns

A clean, searchable catalog of reusable patterns for composing AI Skills — published at
[skillpatterns.ai](https://skillpatterns.ai).

## Local development

Requires Ruby + Bundler.

```bash
bundle install
bundle exec jekyll serve --port 4000
# open http://localhost:4000
```

## Adding or editing a pattern

Each pattern is one Markdown file in `_patterns/`. Copy an existing one and edit the frontmatter:

```yaml
---
title: "My pattern"
slug: my-pattern            # unique; becomes the #anchor and copy target
category: grounding         # one of the keys in _data/categories.yml
order: 4                    # sort order within the category
summary: "One-line definition."
adds:
  - "What it adds, bullet one"
  - "Bullet two"
prompt: |
  The example prompt partial users can copy.
---
```

Categories (titles, descriptions, order) live in `_data/categories.yml`.

## Deployment

GitHub Pages builds this site natively (no Action). In repo **Settings → Pages**:
set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.

### DNS for the apex domain `skillpatterns.ai`

At your DNS registrar, create:

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | <your-username>.github.io |

After DNS propagates, enable **Enforce HTTPS** in Settings → Pages.

## License

MIT — see `LICENSE`.
```

- [ ] **Step 2: Final full-site build smoke test**

Run:
```bash
bundle exec jekyll build
echo "index: $(test -f _site/index.html && echo ok)"
echo "resources: $(test -f _site/resources/index.html && echo ok)"
echo "css: $(test -f _site/assets/css/style.css && echo ok)"
echo "js: $(test -f _site/assets/js/app.js && echo ok)"
echo "cname: $(test -f _site/CNAME && echo ok)"
echo "patterns: $(grep -c 'class="pattern"' _site/index.html)"
```
Expected: five `ok` lines and `patterns: 14`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README with local dev, authoring, and deploy/DNS instructions"
```

- [ ] **Step 4: Hand off for review / PR**

Use superpowers:finishing-a-development-branch to decide how to integrate `skill-patterns-site` (open a PR or merge). Do not push or open a PR without the user's go-ahead.

---

## Self-review (completed during planning)

- **Spec coverage:** Build/deploy (Tasks 1, 8, 9) · content model & collection (Tasks 1, 3) · all 14 patterns (Tasks 3–4) · category taxonomy (Task 3) · sidebar + single-page anchors (Task 3) · search/scroll-spy/copy/theme (Task 6) · light+dark themes & prompt component (Task 5) · resources page (Task 7) · custom domain + DNS (Tasks 8–9). All spec sections map to a task.
- **Placeholder scan:** Bracketed text inside `prompt:` values is intentional pattern content, not plan placeholders. No TBD/TODO steps; every code/file step contains full content.
- **Type/name consistency:** Frontmatter keys (`slug`, `category`, `order`, `summary`, `adds`, `prompt`), CSS classes (`.pattern`, `.cat-section`, `.sidebar-cat`, `.prompt__copy`, `.is-hidden`, `.is-active`), element IDs (`#pattern-search`, `#theme-toggle`, `#prompt-<slug>`), and `data-` attributes (`data-cat`, `data-link`, `data-copy`) are used identically across the include, layout, CSS, and JS tasks.
```

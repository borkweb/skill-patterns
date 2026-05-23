# Skill Patterns

A clean, searchable catalog of reusable patterns for composing AI Skills — published at
[skillpatterns.com](https://skillpatterns.com).

The patterns are grouped by purpose (grounding, critique, decision-making, output shaping,
control & composition), each with a definition, what it adds, and a copyable example prompt
partial. Light/dark themes, client-side search, and deep-linkable anchors — all static, no JS
dependencies.

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

### DNS for the apex domain `skillpatterns.com`

At your DNS registrar, create:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | &lt;your-username&gt;.github.io |

After DNS propagates, enable **Enforce HTTPS** in Settings → Pages.

## License

MIT — see `LICENSE`. Patterns adapted from the talk *Skills & Building Your AI Playbook*
(Automattic, AI Enablement 2026), plus a few later additions.

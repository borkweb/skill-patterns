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

The custom domain is set via the `CNAME` file. Point your registrar's DNS at GitHub Pages
following GitHub's [Managing a custom domain](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
docs, then enable **Enforce HTTPS** in Settings → Pages.

## License

MIT — see `LICENSE`. Patterns adapted from the talk *Skills & Building Your AI Playbook*
(Automattic, AI Enablement 2026), plus a few later additions.

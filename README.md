# Skill Patterns

A clean, searchable catalog of reusable patterns for composing AI Skills — published at
[skillpatterns.com](https://skillpatterns.com).

The patterns are grouped by purpose (grounding, critique, decision-making, output shaping,
control & composition). A scannable card index links to a focused page per pattern, each with
a definition, what it adds, and a copyable example prompt partial. Light/dark themes, instant
full-text search, FontAwesome icons, and per-page SEO (metadata, canonical, Open Graph,
`sitemap.xml`). Built with Jekyll — no CI.

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
slug: my-pattern            # unique; becomes the /patterns/<slug>/ URL and copy target
icon: "fa-solid fa-star"    # any FontAwesome Free solid icon
category: grounding         # one of the keys in _data/categories.yml
summary: "One-line definition."
adds:
  - "What it adds, bullet one"
  - "Bullet two"
prompt: |
  The example prompt partial users can copy.
---
```

Patterns are listed alphabetically by title within their category. Categories (titles,
descriptions, and their display order) live in `_data/categories.yml`.

## Deployment

GitHub Pages builds this site natively (no Action). In repo **Settings → Pages**:
set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.

The custom domain is set via the `CNAME` file. Point your registrar's DNS at GitHub Pages
following GitHub's [Managing a custom domain](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
docs, then enable **Enforce HTTPS** in Settings → Pages.

## License

MIT — see `LICENSE`.

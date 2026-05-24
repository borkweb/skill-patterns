# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Two branches, two jobs

- **`main`** (default) — the installable **plugin** for Claude / Codex / Gemini. Holds the `.claude-plugin/` manifests and the `skills/skill-patterns/` skill.
- **`gh-pages`** — the **website** that publishes [skillpatterns.ai](https://skillpatterns.ai) (a Jekyll site). It holds the **canonical pattern catalog** in `_patterns/*.md` and generates `/llms.txt` and `/patterns.json` on build.

## The catalog lives on gh-pages; the plugin carries a snapshot

The source of truth for the patterns is `_patterns/*.md` on **gh-pages**. The plugin on **main** ships a *generated snapshot* at `skills/skill-patterns/references/patterns.md` — never hand-edit it.

## ⚠️ On ANY catalog change, update BOTH branches

When you add, edit, rename, or remove a pattern (or change categories), do both:

1. **`gh-pages`** — edit the source in `_patterns/` (and `_data/categories.yml` for category changes), then rebuild and verify:
   ```
   bundle exec jekyll build
   ```
2. **`main`** — regenerate the plugin's snapshot from the rebuilt catalog and commit:
   ```
   curl -s https://skillpatterns.ai/llms.txt > skills/skill-patterns/references/patterns.md
   ```
   (Before the site is live, copy the freshly built `_site/llms.txt` instead.)

Commit on **both** branches. A change that lands on only one branch leaves the site and the plugin out of sync.

## Conventions

- Patterns sort **alphabetically by title** within their category; the `order` frontmatter field is unused.
- `/llms.txt` and `/patterns.json` regenerate from `_patterns/` automatically on build — don't edit them by hand.
- Pattern frontmatter: `title`, `slug`, `icon` (FontAwesome Free), `category` (a key in `_data/categories.yml`), `summary`, `adds` (list), `prompt` (block scalar).

## Deploy

GitHub Pages builds from the **`gh-pages`** branch (`CNAME` → skillpatterns.ai lives there). `main` is the default branch and the plugin source.

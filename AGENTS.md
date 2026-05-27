# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Two branches, two jobs

- **`main`** (default) — the canonical home of the **catalog** *and* the installable **plugin** for Claude / Codex / Gemini. Holds `patterns/*.md` (the catalog source), `categories.yml`, the generator `scripts/build.mjs`, the `.claude-plugin/` manifests, and `skills/skill-patterns/`.
- **`gh-pages`** — the **website** that publishes [skillpatterns.ai](https://skillpatterns.ai) (a Jekyll site). Its catalog inputs (`_patterns/`, `_data/categories.yml`, `llms.txt`, `patterns.json`) are **generated** from `main` and synced in by CI. Do not hand-edit them there.

## Adding or editing a pattern

1. Edit (or add) **one file** in `patterns/` on `main`. Frontmatter: `title`, `slug` (must match the filename), `icon` (FontAwesome Free), `category` (a key in `categories.yml`), `summary`, `adds` (list), `related` (list of `{slug, note}`, optional), `prompt` (block scalar).
2. Run `npm run build` — regenerates the plugin snapshot at `skills/skill-patterns/references/patterns.md` (and `build/llms.txt`, `build/patterns.json`).
3. Open **one PR** against `main`. The `Sync catalog` workflow's `snapshot-check` job fails the PR if you skipped step 2. On merge, the `sync-to-pages` job regenerates and pushes `_patterns/`, `_data/categories.yml`, `llms.txt`, and `patterns.json` to `gh-pages`, and the site rebuilds.

No Jekyll, no second branch to edit.

## Never hand-edit generated files

All produced by `scripts/build.mjs` — edit `patterns/` + `categories.yml` and rebuild:

- on `main`: `skills/skill-patterns/references/patterns.md`
- on `gh-pages`: `_patterns/*.md`, `_data/categories.yml`, `llms.txt`, `patterns.json`

## Conventions

- Patterns sort **alphabetically by title** within their category; the pattern `order` field is unused. Category order comes from `order` in `categories.yml`.
- The build **validates input** and fails with a named error on: unknown `category`; duplicate or filename-mismatched `slug`; `adds` that isn't a list; a `related` entry missing `slug`/`note` or pointing at a nonexistent pattern; a category missing a numeric `order`.

## Deploy

GitHub Pages builds from the **`gh-pages`** branch (`CNAME` → skillpatterns.ai lives there). `main` is the default branch, the catalog source, and the plugin source; the `Sync catalog` workflow (`.github/workflows/sync-catalog.yml`) keeps `gh-pages` in sync. Actions minutes are free (public repo).

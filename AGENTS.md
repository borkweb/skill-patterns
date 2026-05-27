# AGENTS.md

Guidance for AI agents (and humans) working on the **`gh-pages`** (website) branch.

## Two branches, two jobs

- **`main`** (default) — the canonical home of the **catalog** *and* the installable plugin. Patterns are authored there as `patterns/*.md` + `categories.yml`, and `scripts/build.mjs` generates the snapshot, `llms.txt`, and `patterns.json`.
- **`gh-pages`** (this branch) — the **Jekyll website** that publishes [skillpatterns.ai](https://skillpatterns.ai). Its catalog inputs are **generated** and synced in from `main` by the `Sync catalog` workflow.

## The catalog is generated — edit it on `main`

These files are produced by `scripts/build.mjs` on `main` and pushed here by CI on every merge to `main`. **Do not hand-edit them** — your change will be overwritten on the next sync:

- `_patterns/*.md`
- `_data/categories.yml`
- `llms.txt` (a static file now — no longer a Liquid template)
- `patterns.json` (likewise)

To change a pattern or category, edit `patterns/<slug>.md` (or `categories.yml`) on `main` and open a PR there.

## Hand-editable on `gh-pages`

The site chrome only — these live here and are edited here:

- `_layouts/`, `_includes/`, `index.*`, `install.md`, styles/assets
- `_config.yml`, `CNAME`, `robots.txt`, analytics

Jekyll still renders the per-pattern pages (`/patterns/:slug/`) and category indexes from the synced `_patterns` collection + `_layouts/pattern`.

## Deploy

GitHub Pages builds from this **`gh-pages`** branch (`CNAME` → skillpatterns.ai). The `Sync catalog` workflow on `main` (`.github/workflows/sync-catalog.yml`) regenerates and pushes the catalog files here, which triggers the Pages rebuild.

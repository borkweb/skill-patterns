# Catalog Source on `main` — Design Spec

**Date:** 2026-05-27
**Status:** Approved (brainstorm) — pending implementation plan

## Overview

Today the canonical pattern catalog lives on the **`gh-pages`** branch (`_patterns/*.md`), and the plugin on **`main`** carries a generated snapshot. To add or edit a pattern, a contributor must work on a *non-default* branch, learn Jekyll frontmatter, run Ruby/Jekyll to verify, and then make a *second* commit on `main` to regenerate the snapshot ("update BOTH branches").

This redesign **inverts the source-of-truth direction**: the canonical catalog moves to **`main`** (the default branch), and everything downstream — the plugin snapshot and the live site's `_patterns/`, `llms.txt`, and `patterns.json` — is **generated**. A contributor edits one markdown file on the default branch and opens one PR; CI handles the rest.

## Goals

- Make the catalog **contributable from the default branch** (`main`) with a single PR.
- Eliminate the **two-branch authoring dance** — patterns are authored in exactly one place.
- Preserve today's published output exactly through the port (**byte-for-byte parity** checkpoint), then layer on `related[]` as the one intentional enrichment — verifying nothing else moved.
- **One renderer** owns the output format — no duplicated template logic.
- Keep the plugin self-contained: it still ships a committed snapshot, regenerated automatically.

## Non-goals

- Collapsing to a single branch / moving the Jekyll site source onto `main` (considered and rejected for now — see Alternatives). `gh-pages` stays a Jekyll branch.
- Changing the pattern **format** — frontmatter is unchanged; only its home moves.
- Changing the site's visual design, layouts, or per-pattern page URLs.
- A bot that auto-commits the regenerated snapshot (considered — see Alternatives).

## Locked decisions

| Decision | Choice |
|---|---|
| Source of truth | `main` (default branch) holds the canonical catalog |
| Sync model | Reverse-sync: CI pushes generated files to `gh-pages`; `gh-pages` stays a Jekyll branch |
| Generator | One **Node** script (`scripts/build.mjs`) on `main` owns the format |
| Generator deps | `js-yaml` (one dep — parses both pattern frontmatter via a `---` split and `categories.yml`) via `package.json` + lockfile on `main` |
| Generated artifacts | plugin snapshot, `llms.txt`, `patterns.json` (Liquid templates retired) |
| Catalog content | Outputs **add `related[]`** — the one intentional change beyond today's format. Rendered as related-pattern **titles** + notes in the snapshot/`llms.txt`, and a `{slug, note}` array in `patterns.json` |
| Snapshot freshness | Failing PR check (`npm run build` + `git diff --exit-code`) — contributor runs `npm run build` |
| Skill read model | Skill reads the **generated snapshot** in one cheap Read (per-file direct-read and progressive-disclosure index both considered and rejected — see Alternatives) |
| Pattern format | Unchanged (`title, slug, icon, category, summary, adds, related[], prompt`) |

## Architecture

### Canonical source on `main`

```
main/
├── patterns/                    ← CANONICAL catalog, one file per pattern (today's _patterns frontmatter, verbatim)
│   ├── adversarial-pushback.md
│   └── … (38)
├── categories.yml               ← CANONICAL category metadata (today's _data/categories.yml)
├── scripts/
│   └── build.mjs                ← the one generator (Node ESM)
├── package.json                 ← "build": "node scripts/build.mjs"; devDep: js-yaml
├── package-lock.json
├── skills/skill-patterns/
│   ├── SKILL.md                 (hand-written)
│   └── references/
│       ├── choosing-patterns.md (hand-written)
│       └── patterns.md          ← GENERATED snapshot — committed, never hand-edited
├── .github/workflows/
│   └── sync-catalog.yml
└── .claude-plugin/ …
```

The pattern files move **verbatim** — same frontmatter they have on `gh-pages` today. The canonical files *are* the full record; the snapshot is a distilled view that still omits site-only fields (`icon`, `order`, layout) but now carries `related[]` for composition hints.

### `scripts/build.mjs` — the single format owner

A Node (ESM) script, run via `npm run build`, that:

1. Reads every `patterns/*.md` (frontmatter via a `---` split + `js-yaml`) and `categories.yml`.
2. Sorts **categories by `order`**, **patterns `sort_natural` by title** within each category — matching the current Liquid behavior. (The `order` field on patterns remains unused.)
3. Resolves each pattern's `related[]` slugs to the related pattern's **title** (building a slug→title map across the catalog first), so output names the paired pattern rather than a bare slug.
4. Emits three artifacts from one format definition:
   - `skills/skill-patterns/references/patterns.md` — the plugin snapshot (identical to `llms.txt`).
   - `build/llms.txt` — for the live `/llms.txt` endpoint.
   - `build/patterns.json` — for the live `/patterns.json` endpoint.

The format **ports the two existing Liquid templates** (`llms.txt`, `patterns.json` on `gh-pages`), including the `https://skillpatterns.ai` base URL Liquid derives from `site.url`, plus **one intentional addition**: each entry gains `related[]` — a `Related: <Title> — <note>; …` line in the snapshot/`llms.txt`, and a `"related": [{ "slug", "note" }]` array in `patterns.json`. Patterns with no `related` omit it. This **retires** the Liquid templates. Resolving `related[]` also makes the build **validate referential integrity** — an unknown related slug fails the build (see Edge cases).

### What `gh-pages` becomes

Still a normal Jekyll branch serving the site. Its catalog inputs become **generated, not authored** — CI writes them in:

| File on `gh-pages` | Origin | How |
|---|---|---|
| `_patterns/*.md` | `main:patterns/*.md` | copied verbatim |
| `_data/categories.yml` | `main:categories.yml` | copied verbatim |
| `llms.txt` (root, static) | `build/llms.txt` | generated, replaces the Liquid template |
| `patterns.json` (root, static) | `build/patterns.json` | generated, replaces the Liquid template |

Generated files are marked via `.gitattributes` (`linguist-generated`) and a note in `gh-pages` `AGENTS.md`/README — **not** inline headers, which in `llms.txt`/`patterns.json`/`_patterns` would break the byte-parity gate. Jekyll still renders the per-pattern pages (`/patterns/:slug/`) and category indexes from the `_patterns` collection + `_layouts/pattern` — those are unchanged.

Hand-authored site chrome (`_layouts/`, `index`, `install.md`, `CNAME`, analytics, `_config.yml`) **stays on `gh-pages`** and is edited there as before — maintainer-only and rare.

### CI + contributor flow (`.github/workflows/sync-catalog.yml`)

**On pull request to `main`** (paths: `patterns/**`, `categories.yml`, `scripts/build.mjs`, `package*.json`):
1. `actions/setup-node` + `npm ci`.
2. `npm run build`.
3. `git diff --exit-code skills/skill-patterns/references/patterns.md` — fails if the committed snapshot is stale, with a message: *"Run `npm run build` and commit the updated snapshot."*

This keeps the snapshot a **reviewable part of the PR** and avoids any post-merge writeback to `main`.

**On push to `main`** (post-merge, same paths):
1. `npm ci && npm run build`.
2. Check out `gh-pages`, copy in the four generated/synced files (table above), commit, push.
3. GitHub Pages rebuilds the site.

No `main → main` writeback occurs: the snapshot already landed via the PR.

### Contributor experience (target)

1. Edit (or add) one file in `patterns/` on `main`.
2. Run `npm run build` (rebuilds the committed snapshot).
3. Open one PR. CI verifies snapshot freshness; on merge, the site syncs automatically.

No Jekyll, no Ruby, no second branch.

## Data flow

```
                    edit one file
contributor ─────────────────────────────▶  main:patterns/*.md  +  categories.yml
                                                      │
                                       npm run build (scripts/build.mjs)
                                                      │
                 ┌────────────────────────────────────┼─────────────────────────────────┐
                 ▼                                    ▼                                   ▼
   skills/.../references/patterns.md          build/llms.txt                     build/patterns.json
        (committed on main,                          │                                   │
         verified by PR check)                       │   on push to main, CI syncs ──────┤
                                                      ▼                                   ▼
                              gh-pages: llms.txt, patterns.json (static),
                              _patterns/*.md + _data/categories.yml (copied verbatim)
                                                      │
                                            GitHub Pages rebuild → skillpatterns.ai
```

## Migration (one-time), with a parity gate

1. Seed `main`: `git checkout gh-pages -- _patterns _data/categories.yml`; move into `main:patterns/` and `main:categories.yml`.
2. Add `package.json`, `package-lock.json`, `scripts/build.mjs`.
3. Run `npm run build`.
4. **Parity gate, phase 1 — faithful port (must pass before anything else):** with `related[]` output temporarily disabled, generated `build/llms.txt`, `build/patterns.json`, and `references/patterns.md` must be **byte-identical** to today's published/committed outputs. Empty diff proves the Node port reproduces the Liquid templates exactly.
5. **Parity gate, phase 2 — enrichment:** enable `related[]` output and confirm the *only* differences from phase 1 are the added `Related:` lines (snapshot/`llms.txt`) and `related` arrays (`patterns.json`) — nothing else moved.
6. Add `.github/workflows/sync-catalog.yml`; run one real end-to-end sync; confirm the live site renders correctly (now including related info on `/llms.txt` and `/patterns.json`).
7. On `gh-pages`: delete the Liquid `llms.txt` and `patterns.json` source templates (now generated and synced as static files). Add DO-NOT-EDIT headers to the synced files via the generator/sync step.
8. Rewrite `AGENTS.md` / `CLAUDE.md` on both branches: replace the "update BOTH branches" rule with the new flow — "edit `patterns/` on `main`, run `npm run build`, open one PR; everything downstream is generated."

## Error handling & edge cases

- **Stale snapshot in a PR** → PR check fails with a clear remediation message; nothing merges out of sync.
- **Malformed pattern frontmatter** (bad YAML, missing required field) → `build.mjs` exits non-zero with the offending filename; the PR check surfaces it.
- **Category referenced by a pattern but absent from `categories.yml`** → build error naming the pattern and missing category key.
- **Unknown `related` slug** (a pattern points at a related slug that doesn't exist) → `build.mjs` fails, naming the source pattern and the bad slug; caught by the PR check. A free integrity benefit of resolving `related[]`.
- **Site-only edits** (layouts, index, install) → made directly on `gh-pages`; never overwritten by the sync (the sync touches only the four catalog files).
- **Sync race / partial failure** → the sync is idempotent (deterministic regenerate + copy); re-running reconciles. A failed sync leaves `gh-pages` on its last good commit.

## Alternatives considered

- **Collapse to one branch** (move Jekyll source onto `main`, `gh-pages` becomes a pure CI build artifact or is replaced by Actions Pages deploy). Cleanest end-state, but relocates and re-tests the whole site + deploy pipeline. Deferred; the reverse-sync gets us the contribution win at far lower risk and remains a stepping stone to this.
- **Manual reversed script** (no CI; maintainer runs a local script to build the snapshot and push `_patterns/`). Lowest tech, but preserves the two-step maintainer ritual. Rejected.
- **Reuse Jekyll's Liquid templates** for the snapshot (sync patterns to `gh-pages`, let Pages rebuild, fetch the built `llms.txt` back into `main`). No duplicated format logic, but the snapshot would depend on a successful deploy (timing/race) and keep a `main → gh-pages → main` round trip. Rejected in favor of one self-contained generator.
- **Ruby generator** (parity with Jekyll). Rejected: Node has lower CI/contributor overhead (`actions/setup-node` + `npm ci`, no rbenv/bundle), at the cost of one small YAML dependency.
- **Bot auto-commits the snapshot** to the PR branch (zero local steps for contributors). Smoother, but more CI machinery and fork-permission nuance (`pull_request_target`). Deferred in favor of the simpler failing PR check.
- **Skill reads per-file sources directly** (no committed snapshot, no freshness check — lightest contributor flow). Rejected: the runtime path runs far more often than contributions, and Claude Code reads one file per tool call, so grounding in the full catalog would cost ~38 Reads *per invocation* plus site-only frontmatter noise. The snapshot pays that cost once, at contribution time. (Shipping was *not* a factor — `marketplace.json` `source: "./"` means the whole repo installs, so a top-level `patterns/` would ship regardless.)
- **Progressive-disclosure index** (skill reads a small generated index, then only the 2–4 selected patterns in full). Best token economics at large scale; more moving parts than justified at 38 patterns. Revisit if the catalog grows into the hundreds.

## Open questions

None blocking. (Resolved during planning: generator dependency is `js-yaml` with a manual `---` frontmatter split — `categories.yml` needs standalone YAML parsing anyway, making `gray-matter` redundant.)

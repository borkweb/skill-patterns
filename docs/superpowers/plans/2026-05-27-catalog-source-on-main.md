# Catalog Source on `main` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the canonical pattern catalog to `main` (the default branch) and generate everything downstream (the plugin snapshot, plus the site's `_patterns/`, `llms.txt`, `patterns.json`) from it, so a contributor edits one file on `main` and opens one PR.

**Architecture:** A single Node generator (`scripts/build.mjs`) on `main` reads `patterns/*.md` + `categories.yml` and emits the plugin snapshot, `llms.txt`, and `patterns.json`. A GitHub Action verifies snapshot freshness on PRs and, on push to `main`, syncs the generated files into the `gh-pages` Jekyll branch. Correctness is proven by a two-phase byte-parity gate against today's published output before cutover.

**Tech Stack:** Node 20 (ESM), `js-yaml`, GitHub Actions, Jekyll (existing, `gh-pages` only).

**Branch strategy:** Most work lands on a branch off `main` (`catalog-source-on-main`). Golden references are captured from the **current** `gh-pages` state first (Task 0). A small `gh-pages` cleanup happens on a branch off `gh-pages` (Task 10).

**Commit convention (per repo owner):** Use the `/commit` (bork:commit) skill for every commit — include all required headings, **no emojis**. The `git commit -m` lines below are the intent; generate the real message with `/commit`.

**Parity is the test.** This project has no unit-test suite; the verification at each gate is a byte-level `diff` against captured golden output. "Expected: empty diff" is a passing test. Liquid whitespace is the main hazard — if a diff isn't empty, adjust `build.mjs` and re-run until it is.

---

## File structure

On `main` (after this plan):

| Path | Responsibility |
|---|---|
| `patterns/*.md` | Canonical catalog — one file per pattern (moved verbatim from `gh-pages:_patterns/`) |
| `categories.yml` | Canonical category metadata (moved from `gh-pages:_data/categories.yml`) |
| `scripts/build.mjs` | The one generator — emits snapshot + `llms.txt` + `patterns.json` |
| `package.json`, `package-lock.json` | `npm run build`; devDep `js-yaml` |
| `.gitignore` | ignores `node_modules/`, `build/` |
| `skills/skill-patterns/references/patterns.md` | GENERATED snapshot (committed, verified by PR check) |
| `.github/workflows/sync-catalog.yml` | PR freshness check + push-to-`gh-pages` sync |
| `AGENTS.md`, `CLAUDE.md` | Updated contributor flow |

`build/` (git-ignored) holds the transient `llms.txt` / `patterns.json` the sync job copies to `gh-pages`.

---

## Task 0: Capture golden reference outputs (from current `gh-pages`)

**Why:** The parity gate compares the new generator's output to today's published output. Capture that output **before** changing anything.

**Files:** none modified — writes goldens to `/tmp/sp-golden/`.

- [ ] **Step 1: Confirm you are on `gh-pages` with a clean tree**

Run: `git -C /Users/matt/git/skill-patterns rev-parse --abbrev-ref HEAD && git -C /Users/matt/git/skill-patterns status --porcelain`
Expected: prints `gh-pages` and shows only the untracked `docs/` (no other changes).

- [ ] **Step 2: Build the live site to render `llms.txt` and `patterns.json`**

Run:
```bash
cd /Users/matt/git/skill-patterns
bundle exec jekyll build
```
Expected: `done in N.NNN seconds`, no errors. (`_site/llms.txt` and `_site/patterns.json` now exist.)

- [ ] **Step 3: Save the three goldens**

Run:
```bash
mkdir -p /tmp/sp-golden
cp _site/llms.txt        /tmp/sp-golden/llms.txt.golden
cp _site/patterns.json   /tmp/sp-golden/patterns.json.golden
git show main:skills/skill-patterns/references/patterns.md > /tmp/sp-golden/snapshot.golden
```
Expected: all three files exist and are non-empty: `wc -c /tmp/sp-golden/*` shows three non-zero sizes.

- [ ] **Step 4: Record the current pattern/category counts (sanity anchor)**

Run: `ls _patterns/*.md | wc -l && grep -c '^- key:' _data/categories.yml`
Expected: `38` and `6`. Note these — the generator must reproduce them.

- [ ] **Step 5: Confirm snapshot vs llms.txt drift (informational)**

Run: `diff /tmp/sp-golden/snapshot.golden /tmp/sp-golden/llms.txt.golden && echo IDENTICAL || echo "PRE-EXISTING DRIFT — note it"`
Expected: `IDENTICAL` (the committed snapshot was curled from `llms.txt`). If it reports drift, note the diff — phase 1 must still match each golden to its own target.

No commit (goldens live in `/tmp`).

---

## Task 1: Create the `main` work branch and seed the canonical source

**Files:**
- Create: `patterns/*.md` (38 files), `categories.yml`

- [ ] **Step 1: Create the branch off `main`**

Run:
```bash
cd /Users/matt/git/skill-patterns
git switch -c catalog-source-on-main main
```
Expected: `Switched to a new branch 'catalog-source-on-main'`. Switching updates tracked files to `main`'s tree and leaves the untracked `docs/` in place — no stash needed, since `main` has no `docs/` to conflict.

- [ ] **Step 2: Seed `patterns/` and `categories.yml` from `gh-pages` (verbatim)**

Run:
```bash
git checkout gh-pages -- _patterns _data/categories.yml
mkdir -p patterns
git mv _patterns/*.md patterns/
git mv _data/categories.yml categories.yml
rmdir _data 2>/dev/null || true
```
Expected: `patterns/` holds 38 `.md` files; `categories.yml` at repo root. Verify: `ls patterns/*.md | wc -l` → `38`.

- [ ] **Step 3: Confirm the seeded files are byte-identical to the source**

Run: `git show gh-pages:_patterns/adversarial-pushback.md | diff - patterns/adversarial-pushback.md && echo OK`
Expected: `OK` (no diff). Compares the `gh-pages` version directly against the moved file without touching the index (`git mv` preserves content; this is a sanity check).

- [ ] **Step 4: Commit the seed**

```bash
git add patterns categories.yml
# Use /commit (bork:commit). Intent:
#   feat: add canonical pattern catalog to main (patterns/ + categories.yml)
```
Run `/commit` and confirm the commit lands on `catalog-source-on-main`.

---

## Task 2: Add the Node package and `.gitignore`

**Files:**
- Create: `package.json`, `.gitignore`
- Create (generated by npm): `package-lock.json`

- [ ] **Step 1: Write `package.json`**

Create `package.json`:
```json
{
  "name": "skill-patterns-catalog",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Build tooling for the Skill Patterns catalog (generates the plugin snapshot, llms.txt, and patterns.json).",
  "scripts": {
    "build": "node scripts/build.mjs"
  },
  "devDependencies": {
    "js-yaml": "^4.1.0"
  }
}
```

- [ ] **Step 2: Write `.gitignore`** (merge with any existing entries; do not drop existing lines)

Ensure `.gitignore` contains:
```
node_modules/
build/
```

- [ ] **Step 3: Install to generate the lockfile**

Run: `npm install`
Expected: creates `node_modules/` and `package-lock.json`; exit 0. (`js-yaml` resolved.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
# /commit intent: chore: add node build tooling (js-yaml) and gitignore
```

---

## Task 3: Write the generator `scripts/build.mjs`

**Files:**
- Create: `scripts/build.mjs`

- [ ] **Step 1: Write `scripts/build.mjs`**

Create `scripts/build.mjs`:
```js
#!/usr/bin/env node
// Generates the Skill Patterns catalog outputs from patterns/*.md + categories.yml.
//   skills/skill-patterns/references/patterns.md  -> plugin snapshot (identical to llms.txt)
//   build/llms.txt                                -> live /llms.txt
//   build/patterns.json                           -> live /patterns.json
// Do NOT hand-edit outputs. Edit patterns/ and run `npm run build`.
// Flag: --no-related  (omit related[] — used only for the phase-1 parity gate)

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://skillpatterns.ai';
const INCLUDE_RELATED = !process.argv.includes('--no-related');
const REQUIRED = ['title', 'slug', 'category', 'summary', 'adds', 'prompt'];

function readFrontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`${basename(file)}: no YAML frontmatter`);
  return yaml.load(m[1]);
}

const categories = yaml.load(readFileSync(join(ROOT, 'categories.yml'), 'utf8'));
const sortedCats = [...categories].sort((a, b) => a.order - b.order);

const dir = join(ROOT, 'patterns');
const patterns = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const data = readFrontmatter(join(dir, f));
    data._base = f.replace(/\.md$/, '');
    return data;
  });

const titleBySlug = new Map(patterns.map((p) => [p.slug, p.title]));
const catKeys = new Set(categories.map((c) => c.key));

for (const p of patterns) {
  for (const k of REQUIRED) {
    if (p[k] == null) throw new Error(`${p._base}.md: missing required field '${k}'`);
  }
  if (!catKeys.has(p.category)) {
    throw new Error(`${p._base}.md: unknown category '${p.category}'`);
  }
  for (const r of p.related ?? []) {
    if (!titleBySlug.has(r.slug)) {
      throw new Error(`${p._base}.md: related slug '${r.slug}' does not exist`);
    }
  }
}

const patternsIn = (catKey) =>
  patterns
    .filter((p) => p.category === catKey)
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

const stripNewlines = (s) => String(s).replace(/\r?\n/g, '');

function buildLlms() {
  let o = '';
  o += `# Skill Patterns\n\n`;
  o += `> Reusable, composable techniques for shaping how an AI agent behaves — ${patterns.length} patterns across ${categories.length} categories. When creating or improving a Skill, apply the patterns whose purpose matches the task; each entry includes an example prompt you can adapt. Most skills use 2–4 patterns — don't over-apply. Site: ${SITE_URL}/\n`;
  for (const cat of sortedCats) {
    o += `\n## ${cat.title}\n${cat.description}\n`;
    for (const p of patternsIn(cat.key)) {
      o += `\n### ${p.title}\n`;
      o += `${p.summary}\n`;
      o += `- What it adds: ${p.adds.join('; ')}.\n`;
      o += `- Example prompt: ${stripNewlines(p.prompt)}\n`;
      o += `- URL: ${SITE_URL}/patterns/${p._base}/\n`;
      if (INCLUDE_RELATED && p.related?.length) {
        const rel = p.related.map((r) => `${titleBySlug.get(r.slug)} — ${r.note}`).join('; ');
        o += `- Related: ${rel}\n`;
      }
    }
  }
  o += `\n`;
  return o;
}

function buildJson() {
  const j = JSON.stringify;
  const objs = [];
  for (const cat of sortedCats) {
    for (const p of patternsIn(cat.key)) {
      let s =
        `{"title":${j(p.title)},"slug":${j(p.slug)},"category":${j(cat.title)},` +
        `"categoryKey":${j(p.category)},"summary":${j(p.summary)},"adds":${j(p.adds)},` +
        `"prompt":${j(stripNewlines(p.prompt))},"url":${j(`${SITE_URL}/patterns/${p._base}/`)}`;
      if (INCLUDE_RELATED && p.related?.length) {
        s += `,"related":${j(p.related.map((r) => ({ slug: r.slug, note: r.note })))}`;
      }
      objs.push(s + `}`);
    }
  }
  return `[${objs.join(',')}]\n`;
}

const llms = buildLlms();
mkdirSync(join(ROOT, 'build'), { recursive: true });
writeFileSync(join(ROOT, 'build', 'llms.txt'), llms);
writeFileSync(join(ROOT, 'build', 'patterns.json'), buildJson());
writeFileSync(join(ROOT, 'skills', 'skill-patterns', 'references', 'patterns.md'), llms);
console.log(
  `Generated ${patterns.length} patterns across ${categories.length} categories (related: ${INCLUDE_RELATED ? 'on' : 'off'}).`
);
```

- [ ] **Step 2: Run it once to confirm it executes**

Run: `npm run build`
Expected: `Generated 38 patterns across 6 categories (related: on).` and `build/llms.txt`, `build/patterns.json`, and `skills/skill-patterns/references/patterns.md` are written. Do **not** commit yet — parity comes first.

---

## Task 4: Parity gate — phase 1 (faithful port, `related` disabled)

**Goal:** Prove the Node port reproduces today's output exactly, ignoring the deliberate `related` addition.

- [ ] **Step 1: Generate with `related` disabled**

Run: `node scripts/build.mjs --no-related`
Expected: `Generated 38 patterns across 6 categories (related: off).`

- [ ] **Step 2: Diff `llms.txt` against golden**

Run: `diff /tmp/sp-golden/llms.txt.golden build/llms.txt && echo PASS`
Expected: `PASS` (empty diff).

If not empty, the difference is almost certainly one of: trailing-newline count at EOF; `2–4` (en dash U+2013) vs `2-4`; `behaves —` / `don't` (em dash U+2014, straight apostrophe — copy from the golden, don't retype); category/pattern sort order (`localeCompare` case-insensitive); or the `Site: …/` trailing slash. Adjust `build.mjs` string literals to match the golden byte-for-byte and re-run Steps 1–2.

- [ ] **Step 3: Diff `patterns.json` against golden**

Run: `diff /tmp/sp-golden/patterns.json.golden build/patterns.json && echo PASS`
Expected: `PASS`. Likely culprits if not: key order in each object; `adds`/`prompt` escaping (`JSON.stringify` vs Ruby `jsonify` — both leave UTF-8 unescaped, so em dashes should match); single trailing newline after `]`.

- [ ] **Step 4: Diff the snapshot against golden**

Run: `diff /tmp/sp-golden/snapshot.golden skills/skill-patterns/references/patterns.md && echo PASS`
Expected: `PASS` (the snapshot is the same text as `llms.txt`).

- [ ] **Step 5: Gate**

All three diffs must print `PASS`. Do not proceed to Task 5 until phase 1 is clean. No commit yet.

---

## Task 5: Parity gate — phase 2 (enable `related`, verify only-additions)

**Goal:** Turn `related` back on and confirm the *only* change from phase 1 is the added related content.

- [ ] **Step 1: Regenerate with `related` on (default)**

Run: `npm run build`
Expected: `... (related: on).`

- [ ] **Step 2: Confirm `llms.txt` differs from golden ONLY by `- Related:` lines**

Run: `diff /tmp/sp-golden/llms.txt.golden build/llms.txt`
Expected: every diff hunk is a pure **addition** (`>`) of a line beginning `- Related: `. No `<` (removed) or changed lines. Spot-check one: `grep -c '^- Related: ' build/llms.txt` should be > 0 and ≤ 38.

- [ ] **Step 3: Confirm `patterns.json` differs ONLY by `related` keys**

Run:
```bash
node -e '
const fs = require("fs");
const a = JSON.parse(fs.readFileSync("/tmp/sp-golden/patterns.json.golden", "utf8"));
const b = JSON.parse(fs.readFileSync("./build/patterns.json", "utf8"));
if (a.length !== b.length) { console.error("length mismatch", a.length, b.length); process.exit(1); }
for (let i = 0; i < a.length; i++) {
  const { related, ...rest } = b[i];
  if (JSON.stringify(rest) !== JSON.stringify(a[i])) { console.error("MISMATCH at", i, a[i].slug); process.exit(1); }
}
console.log("PASS: only related[] added");'
```
Expected: `PASS: only related[] added`. Strips `related` from each new object and confirms the rest equals the golden object. (Reads + `JSON.parse`s the golden — its `.golden` extension means `require` won't auto-parse it.)

- [ ] **Step 4: Confirm snapshot == llms.txt**

Run: `diff build/llms.txt skills/skill-patterns/references/patterns.md && echo IDENTICAL`
Expected: `IDENTICAL`.

- [ ] **Step 5: Commit the generator + the generated snapshot**

```bash
git add scripts/build.mjs skills/skill-patterns/references/patterns.md
# /commit intent:
#   feat: generate catalog outputs from main via scripts/build.mjs
#   - snapshot now includes related[] (composition hints)
```
Run `/commit`. (`build/` is git-ignored, so only the snapshot + script are staged.)

---

## Task 6: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/sync-catalog.yml`

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/sync-catalog.yml`:
```yaml
name: Sync catalog

on:
  pull_request:
    branches: [main]
    paths:
      - 'patterns/**'
      - 'categories.yml'
      - 'scripts/build.mjs'
      - 'package.json'
      - 'package-lock.json'
  push:
    branches: [main]
    paths:
      - 'patterns/**'
      - 'categories.yml'
      - 'scripts/build.mjs'
      - 'package.json'
      - 'package-lock.json'

permissions:
  contents: write

jobs:
  snapshot-check:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Verify the committed snapshot is up to date
        run: |
          if ! git diff --quiet -- skills/skill-patterns/references/patterns.md; then
            echo "::error::Snapshot is stale. Run 'npm run build' and commit skills/skill-patterns/references/patterns.md."
            git --no-pager diff -- skills/skill-patterns/references/patterns.md
            exit 1
          fi
          echo "Snapshot is up to date."

  sync-to-pages:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Check out main
        uses: actions/checkout@v4
        with:
          path: main
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: main/package-lock.json
      - name: Build catalog outputs
        working-directory: main
        run: |
          npm ci
          npm run build
      - name: Check out gh-pages
        uses: actions/checkout@v4
        with:
          ref: gh-pages
          path: pages
      - name: Sync generated files into gh-pages
        run: |
          rm -rf pages/_patterns
          mkdir -p pages/_patterns pages/_data
          cp main/patterns/*.md      pages/_patterns/
          cp main/categories.yml     pages/_data/categories.yml
          cp main/build/llms.txt     pages/llms.txt
          cp main/build/patterns.json pages/patterns.json
      - name: Commit and push to gh-pages
        working-directory: pages
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add _patterns _data/categories.yml llms.txt patterns.json
          if git diff --cached --quiet; then
            echo "No catalog changes to sync."
          else
            git commit -m "chore: sync catalog from main@${GITHUB_SHA::7}"
            git push
          fi
```

- [ ] **Step 2: Validate the workflow YAML locally**

Run: `node -e 'const fs=require("fs"),yaml=require("js-yaml");yaml.load(fs.readFileSync(".github/workflows/sync-catalog.yml","utf8"));console.log("valid YAML")'`
Expected: `valid YAML`.

> **Caveat:** GitHub Actions does **not** support YAML anchors/aliases in workflow files — the `paths` list is intentionally repeated for `pull_request` and `push`, not aliased. Also, if `gh-pages` has branch protection blocking the `github-actions[bot]` push, `sync-to-pages` will fail; grant the default token push access to `gh-pages` or use a PAT secret.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/sync-catalog.yml
# /commit intent: ci: sync catalog to gh-pages on push; verify snapshot freshness on PRs
```

---

## Task 7: Update `main` docs (AGENTS.md / CLAUDE.md)

**Files:**
- Modify: `AGENTS.md`, `CLAUDE.md` (both currently say "update BOTH branches" with the old direction)

- [ ] **Step 1: Read the current files**

Run: `cat AGENTS.md` (and note `CLAUDE.md` is the same content per the repo convention).

- [ ] **Step 2: Replace the "Two branches" + "On ANY catalog change" sections**

Replace the catalog-workflow guidance with the new direction. The replacement text:
```markdown
## Two branches, two jobs

- **`main`** (default) — the canonical home of the catalog **and** the installable plugin. Holds `patterns/*.md`, `categories.yml`, the generator (`scripts/build.mjs`), and the plugin under `skills/skill-patterns/`.
- **`gh-pages`** — the **website** ([skillpatterns.ai](https://skillpatterns.ai), Jekyll). Its catalog inputs (`_patterns/`, `_data/categories.yml`, `llms.txt`, `patterns.json`) are **generated** — synced in by CI from `main`. Do not hand-edit them.

## Adding or editing a pattern

1. Edit (or add) one file in `patterns/` on `main`. Frontmatter: `title, slug, icon, category, summary, adds, related, prompt`.
2. Run `npm run build` (regenerates `skills/skill-patterns/references/patterns.md`).
3. Open one PR. The `snapshot-check` job fails if you forgot step 2. On merge, `sync-to-pages` regenerates and pushes the site's catalog files to `gh-pages`.

Patterns sort **alphabetically by title** within their category (the `order` field is unused). `categories.yml` `order` sets category order.

## Never hand-edit generated files

`skills/skill-patterns/references/patterns.md` (on `main`) and `_patterns/`, `_data/categories.yml`, `llms.txt`, `patterns.json` (on `gh-pages`) are all generated by `scripts/build.mjs`. Edit `patterns/` + `categories.yml` and rebuild.
```

- [ ] **Step 3: Mirror the change into `CLAUDE.md`** (same content, matching the repo's existing AGENTS.md/CLAUDE.md parity).

- [ ] **Step 4: Fix the generation note in `skills/skill-patterns/SKILL.md`**

The last line currently reads: *"`references/patterns.md` is a generated snapshot of the live catalog (`skillpatterns.ai/llms.txt`); regenerate it when the catalog changes."* Replace it with:
> `references/patterns.md` is generated from the canonical catalog on `main` (`patterns/*.md` + `categories.yml`) by `scripts/build.mjs` — run `npm run build` after editing a pattern. Never hand-edit it.

Leave the rest of `SKILL.md` (including the "live source is `https://skillpatterns.ai/llms.txt`" tip) unchanged.

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md CLAUDE.md skills/skill-patterns/SKILL.md
# /commit intent: docs: rewrite catalog contribution flow (edit patterns/ on main, one PR)
```

- [ ] **Step 6: Push the branch and open the PR**

```bash
git push -u origin catalog-source-on-main
gh pr create --base main --title "Move catalog source to main; generate downstream" \
  --body "See docs/superpowers/plans/2026-05-27-catalog-source-on-main.md. Inverts the catalog source-of-truth to main; CI generates the snapshot and syncs the site."
```
Expected: PR opens; the `snapshot-check` job runs and **passes** (snapshot was committed in Task 5).

---

## Task 8: Verify the sync end-to-end locally (before merge)

**Why:** Prove the `sync-to-pages` copy logic produces a working site that still renders today's output (plus related), without waiting on a live deploy.

**Files:** none committed — uses a throwaway `gh-pages` worktree.

- [ ] **Step 1: Create a gh-pages worktree**

Run:
```bash
cd /Users/matt/git/skill-patterns
git worktree add /tmp/sp-pages gh-pages
```
Expected: worktree created at `/tmp/sp-pages`.

- [ ] **Step 2: Run the sync copy commands (mirror the workflow)**

Run:
```bash
cd /Users/matt/git/skill-patterns        # the catalog-source-on-main checkout
npm run build
rm -rf /tmp/sp-pages/_patterns && mkdir -p /tmp/sp-pages/_patterns /tmp/sp-pages/_data
cp patterns/*.md        /tmp/sp-pages/_patterns/
cp categories.yml       /tmp/sp-pages/_data/categories.yml
cp build/llms.txt       /tmp/sp-pages/llms.txt
cp build/patterns.json  /tmp/sp-pages/patterns.json
```
Expected: files copied; `ls /tmp/sp-pages/_patterns/*.md | wc -l` → `38`. The `cp` overwrites `gh-pages`'s Liquid `llms.txt`/`patterns.json` in the worktree with the static generated versions — exactly what the real sync does.

- [ ] **Step 3: Build Jekyll in the worktree and confirm the static output wins**

Run: `cd /tmp/sp-pages && bundle exec jekyll build && diff _site/llms.txt llms.txt && echo MATCH`
Expected: `done`, no errors, then `MATCH`. Because Step 2's `cp` replaced the front-matter Liquid templates with front-matter-free static files, Jekyll copies them verbatim (no Liquid processing), so `_site/llms.txt` equals the generated `build/llms.txt`. This previews exactly what Task 10 makes permanent.

- [ ] **Step 4: Confirm a pattern page renders and includes related**

Run: `grep -l 'adversarial' /tmp/sp-pages/_site/patterns/adversarial-pushback/index.html && echo PAGE_OK`
Expected: `PAGE_OK` (the per-pattern page still builds from the synced `_patterns/`).

- [ ] **Step 5: Tear down the worktree**

Run: `cd /Users/matt/git/skill-patterns && git worktree remove /tmp/sp-pages --force`
Expected: worktree removed. No commit.

---

## Task 9: Merge `main` PR, then enable the real sync

- [ ] **Step 1: Merge the PR** once `snapshot-check` is green and review is done.

Run: `gh pr merge catalog-source-on-main --squash` (or via UI).
Expected: merged to `main`; the `sync-to-pages` job triggers on the push.

- [ ] **Step 2: Watch the sync job**

Run: `gh run watch` (or `gh run list --workflow sync-catalog.yml`).
Expected: `sync-to-pages` succeeds and pushes a `chore: sync catalog from main@…` commit to `gh-pages`.

- [ ] **Step 3: Confirm `gh-pages` received the generated files**

Run: `git fetch origin gh-pages && git show origin/gh-pages:llms.txt | head -3`
Expected: the intro line with `38 patterns across 6 categories`. (`_patterns/` and `patterns.json` updated too.)

---

## Task 10: Mark generated files and update `gh-pages` docs

**Why:** After Task 9's first sync, the committed `llms.txt`/`patterns.json` on `gh-pages` are **already** the static, front-matter-free generated files — the sync `cp` overwrote the old Liquid templates in place. The remaining work is to mark the catalog files as generated and document the new flow so no one hand-edits them.

**Files (on a branch off `gh-pages`):**
- Create: `.gitattributes`
- Modify: `AGENTS.md` (gh-pages copy)
- Verify (no change expected): `llms.txt`, `patterns.json` are static

- [ ] **Step 1: Branch off the synced `gh-pages`**

Run:
```bash
cd /Users/matt/git/skill-patterns
git fetch origin gh-pages
git switch -c retire-liquid-templates origin/gh-pages
```

- [ ] **Step 2: Confirm the catalog files are now static (Liquid retired by the sync)**

Run: `head -1 llms.txt; head -c 2 patterns.json; echo`
Expected: `# Skill Patterns` and `[{` — i.e. **no** `---`/`permalink` front matter. If either still begins with `---`, the sync didn't overwrite it: copy the generated file from `main`'s `build/` output over it and `git add` it before continuing.

- [ ] **Step 3: Add `.gitattributes` marking the generated files**

Create `.gitattributes`:
```
_patterns/** linguist-generated=true
_data/categories.yml linguist-generated=true
llms.txt linguist-generated=true
patterns.json linguist-generated=true
```

- [ ] **Step 4: Update `gh-pages` `AGENTS.md`**

Replace the catalog-workflow section with a pointer to `main`:
```markdown
## The catalog is generated — edit it on `main`

`_patterns/`, `_data/categories.yml`, `llms.txt`, and `patterns.json` are **generated** by `scripts/build.mjs` on `main` and synced here by the `Sync catalog` workflow. **Do not hand-edit them.** To change a pattern, edit `patterns/<slug>.md` on `main` and open a PR.

Hand-editable on `gh-pages`: layouts, `index`, `install.md`, styles, `_config.yml`, `CNAME` — the site chrome only.
```

- [ ] **Step 5: Build to confirm the site still renders**

Run: `bundle exec jekyll build && diff _site/llms.txt llms.txt && echo MATCH && test -f _site/patterns/adversarial-pushback/index.html && echo PAGE_OK`
Expected: `done`, no errors, then `MATCH` and `PAGE_OK`.

- [ ] **Step 6: Commit and open the PR**

```bash
git add -A
# /commit intent: chore: mark catalog files generated; document edit-on-main flow
git push -u origin retire-liquid-templates
gh pr create --base gh-pages --title "Mark catalog files generated; document edit-on-main flow" \
  --body "Catalog files are generated by main's build + Sync catalog workflow. See docs/superpowers/plans/2026-05-27-catalog-source-on-main.md."
```

- [ ] **Step 7: Merge and verify the live site**

After merge, confirm `https://skillpatterns.ai/llms.txt` shows the `- Related:` lines and the pattern count is unchanged (38).

---

## Done criteria

- Editing `patterns/<slug>.md` on `main` + `npm run build` + one PR is the entire contribution flow.
- `snapshot-check` fails a PR that forgot `npm run build`.
- On merge, `sync-to-pages` regenerates and pushes `_patterns/`, `_data/categories.yml`, `llms.txt`, `patterns.json` to `gh-pages`.
- `llms.txt`/`patterns.json`/snapshot match today's output except for the added `related[]` content (proven by the two-phase parity gate).
- No file on `gh-pages` is hand-edited for catalog content; `llms.txt`/`patterns.json` are static generated files (Liquid templates retired by the sync) and marked `linguist-generated`.
- `AGENTS.md`/`CLAUDE.md` on both branches describe the new flow.

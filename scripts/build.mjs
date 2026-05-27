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

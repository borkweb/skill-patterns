# Design System — skillpatterns.ai

The site's visual language, captured so changes stay consistent. The source of
truth is `assets/css/style.css`; this file explains the intent behind it.

## Principles

- **Semantic tokens, never hard-coded color.** Every color is a CSS variable on
  `:root` with a `[data-theme="dark"]` override. New components must use tokens
  so dark mode works for free.
- **Restraint.** Subtraction default — an element earns its pixels or it's cut.
- **Accessibility is not optional.** Text meets WCAG AA contrast (≥4.5:1);
  interactive chrome meets the 44px touch target (AAA 2.5.5) where practical, and
  never less than 24px (AA 2.5.8). Keyboard focus is always visible.

## Color tokens

Defined in `:root` (light) and overridden under `[data-theme="dark"]`.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg` | `#ffffff` | `#0f1115` | Page background |
| `--bg-elevated` | `#f7f8fa` | `#14161c` | Cards, chips, inputs, hovers |
| `--border` | `#e7e9ee` | `#23262f` | Hairline dividers |
| `--border-strong` | `#dfe2e8` | `#2a2e38` | Input borders, emphasis |
| `--text` | `#0b1020` | `#f1f3f8` | Primary text, headings |
| `--text-muted` | `#4b5263` | `#a9b0be` | Body copy, secondary text |
| `--text-faint` | `#6b7280` | `#8b93a3` | Tertiary labels, captions, footer |
| `--accent` | `#3858E9` | `#6b8aff` | Links, active state, highlights |
| `--accent-contrast` | `#ffffff` | `#0b1020` | Text on an accent fill |

The `--prompt-*` tokens style the example-prompt card (a warm "code" surface).

**Contrast rule:** `--text-faint` is the lightest text allowed on body copy and
clears 4.5:1 on both `--bg` and `--bg-elevated`. Do not introduce a lighter gray
for text. Verify any new text/background pair at ≥4.5:1 (≥3:1 for ≥18px bold).

### Category accents (`--cat`)

Color is **wayfinding**: each of the six categories owns a hue, set as a `--cat`
variable on `[data-cat="<key>"]` (the home section, sidebar group, jump-nav chip,
and pattern-detail wrapper). Because custom properties inherit, descendants just
reference `var(--cat, var(--accent))` — section titles, sidebar labels, chip text,
card icon tiles, the detail eyebrow/title/bullets, and the active-pattern tint all
pick it up automatically.

| Category | Light | Dark |
|----------|-------|------|
| `grounding` | `#3858E9` | `#6b8aff` |
| `decision` | `#0B7D6F` | `#3fd6c0` |
| `output` | `#683FE6` | `#a48bff` |
| `critique` | `#C5314C` | `#ff7d94` |
| `control` | `#8F5E12` | `#e0a64a` |
| `composition` | `#23783A` | `#5fc06f` |

Light hues are tuned to clear **4.5:1 on `--bg-elevated`** (the chip background, the
strictest case); dark hues clear it comfortably. Adding/recoloring a category means
adding a `--cat` pair here and re-verifying contrast. Tints (icon tiles, active
state) are derived with `color-mix(in srgb, var(--cat) N%, …)`, so they track the
hue automatically — never hard-code a tint.

## Typography

- **Sans:** system stack (`--sans`). **Mono:** system mono (`--mono`), used for the
  hero eyebrow and prompt bodies.
- **Scale (px):** hero `clamp(40,7vw,68)` · page h1 `36` · intro h1 `34` · pattern
  title `22` · card/section titles `16` · body `15.5–16` · meta/labels `11–14`.
- **Weight:** 800 for display/brand, 700 for titles, 500–600 for UI, 400 body.
- Uppercase micro-labels use `letter-spacing: .05–.07em` and `--text-faint`/`--accent`.

## Spacing

Informal scale; prefer multiples of ~4 (`4, 6, 8, 10, 14, 16, 18, 22, 26`).
Section rhythm leans on `padding-top` + a `--border` top rule. Radii: `--radius`
(10px) for surfaces, `8px` buttons/inputs, `12–16px` cards, `999px` pills.

## Components

- **Header** (`.site-header`) — sticky, `--header-h` (57px) tall. Nav links are
  44px tap targets; the GitHub link is a FontAwesome brand glyph with an
  `aria-label`.
- **Theme toggle** (`.theme-toggle`) — 40px button; FontAwesome moon/sun swapped
  by `[data-theme]` via `::before`.
- **Cards** (`.pcard`) — bordered, `--card-bg`, lift on hover (gated by
  `prefers-reduced-motion`).
- **Sidebar** (`.sidebar`) — desktop: sticky index. Mobile (≤820px): collapses
  behind a `.sidebar-toggle` disclosure (`aria-expanded`/`aria-controls`), with an
  animated reveal and rotating chevron.
- **Category nav** (`.cat-nav`) — sticky, horizontally-scrollable pill chips that
  jump to `#cat-<key>` sections on the home page.
- **Prompt card** (`.prompt`) — the warm-toned copyable example partial.

## Icons

FontAwesome 6 Free (loaded via CDN, `preconnect`ed). Use `<i class="fa-solid …">`
or `fa-brands` for brand marks. Don't mix in unicode glyphs or emoji — they render
inconsistently across platforms.

## Motion

- Transitions ≤ ~250ms, `ease`/`ease-out`. Every animation has a purpose
  (affordance, confirmation, reveal) — no decorative motion.
- **Always gate motion** behind `@media (prefers-reduced-motion: reduce)` — see the
  block at the top of `style.css`.

## Responsive

- **≤820px:** layout stacks; sidebar becomes the disclosure; nav labels shorten
  ("What?", "Using"). This range serves tablets.
- **≤560px:** phone tightening — smaller hero, reduced padding, tighter card gap.

## Accessibility checklist for new work

1. Color pairs ≥4.5:1 (text) / ≥3:1 (large bold, non-text).
2. Interactive targets ≥44px (≥24px minimum for dense lists).
3. Visible `:focus-visible` ring (inherited globally — don't remove it).
4. Decorative icons get `aria-hidden="true"`; icon-only controls get `aria-label`.
5. Any motion respects `prefers-reduced-motion`.

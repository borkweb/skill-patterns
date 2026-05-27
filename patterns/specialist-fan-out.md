---
title: "Specialist fan-out"
slug: specialist-fan-out
icon: "fa-solid fa-sitemap"
category: composition
summary: "Splits a review or analysis across several agents running in parallel, each with a different lens, then merges their complementary findings into one synthesis."
adds:
  - "Runs several specialists at once — each owning a distinct aspect — instead of one generalist pass"
  - "Dispatches only the lenses the work actually calls for"
  - "Merges and de-duplicates complementary findings into one ranked result — coverage, not a vote"
related:
  - slug: best-of-n
    note: "Best-of-N runs the same problem redundantly and votes for reliability; fan-out runs different lenses and merges for coverage."
  - slug: decomposition
    note: "Decomposition splits work into sequential sub-tasks for one worker; fan-out runs specialists in parallel, then synthesizes."
  - slug: adversarial-pushback
    note: "A panel of narrow critics is a fan-out aimed at review; adversarial-pushback is the single-challenger case."
prompt: |
  For [reviewing / analyzing / mapping] [target] where several distinct concerns matter, don't make one pass try to cover everything. Fan out: launch a separate agent per lens — [e.g. correctness, security, performance, test coverage, type design] — running in parallel, each focused only on its aspect and returning findings with specific evidence ([file:line], quotes). Dispatch only the lenses the work actually calls for. Then merge: collect every agent's findings, de-duplicate the overlaps, and synthesize one ranked result. The point is coverage — each agent catches what the others miss — not running the same check several times to vote on it.
---

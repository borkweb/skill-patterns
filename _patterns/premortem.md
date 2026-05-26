---
title: "Premortem"
slug: premortem
icon: "fa-solid fa-skull"
category: critique
order: 4
summary: "Imagines the work has already shipped and failed, then reasons backward to the cause — and the assumption behind it."
adds:
  - "Generates the most plausible failure stories before the work ships"
  - "Surfaces risks that wouldn't appear in a forward-looking review"
  - "Names which current assumptions, if wrong, cause the failure"
related:
  - slug: adversarial-pushback
    note: "Pushback argues against the work in the present; premortem imagines it already failed and traces why."
  - slug: failure-mode-preloading
    note: "Failure-mode-preloading lists known, recurring failure types up front; premortem invents specific failure stories for this work."
prompt: |
  Before finalizing [the plan / the decision / the proposal], run a premortem. Imagine it's [6 months / a year / one quarter] from now and this work has clearly failed. Generate the 3 most plausible failure stories — what went wrong, in what order, and why it wasn't caught in time. For each, name the assumption in the current plan that, if wrong, made the failure inevitable. Return the failure stories alongside the original work, with the riskiest assumptions called out.
---

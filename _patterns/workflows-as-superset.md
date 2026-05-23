---
title: "Workflows as superset"
slug: workflows-as-superset
icon: "fa-solid fa-diagram-project"
category: composition
order: 3
summary: "Composes this Skill with others into a sequenced flow."
adds:
  - "Triggers other Skills in a defined order"
  - "Passes outputs from one stage as inputs to the next"
  - "Surfaces workflow state so you can see where you are in the chain"
prompt: |
  Run this as a workflow: [Skill 1] → [Skill 2] → [Skill 3]. Pass the output of each stage as input to the next. After each stage, summarize what was produced and confirm before moving on. If a stage fails its checks, stop and surface the issue rather than continuing.
---

---
title: "Trusted sources"
slug: trusted-sources
icon: "fa-solid fa-anchor"
category: grounding
order: 1
summary: "Anchors the agent in specific authoritative references so it stops improvising from training data."
adds:
  - "Cites which source supports each claim"
  - "Defers to specified sources when they conflict with general knowledge"
  - "Flags gaps instead of filling them silently"
prompt: |
  Ground this Skill in the following authoritative sources: [URLs / paths / docs]. When the task touches this area, consult these first. If your training contradicts these sources, the sources win. Cite which source each claim comes from. If a source is missing or ambiguous, flag the gap rather than filling it from prior knowledge.
---

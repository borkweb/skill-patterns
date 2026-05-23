---
title: "Exemplars over instruction"
slug: exemplars-over-instruction
icon: "fa-solid fa-star"
category: grounding
order: 2
summary: "Anchors the Skill's output in concrete examples of \"good\" rather than describing it in rules."
adds:
  - "Matches the shape, voice, and structure of provided examples"
  - "Surfaces which exemplar it drew from when the choice is ambiguous"
  - "Asks for a new exemplar when the work falls outside the set"
prompt: |
  Here are exemplars of [strong outputs / preferred voice / target format]: [paste 2-4 examples]. Match the shape and voice of these rather than following rules I might write down. When the task falls outside what the exemplars cover, say so and ask for a new exemplar instead of guessing. Cite which exemplar most influenced the output.
---

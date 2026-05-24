---
title: "Self-tuning"
slug: self-tuning
icon: "fa-solid fa-arrows-rotate"
category: critique
summary: "After a run, the Skill flags its own ambiguous or missing instructions and proposes concrete edits to itself."
adds:
  - "Notices where its own instructions were unclear, incomplete, or forced a workaround"
  - "Proposes a specific edit — quotes the line and gives the replacement — not a vague 'could be better'"
  - "Distinguishes a clean run from one that surfaced an improvement worth making"
prompt: |
  After completing [task], reflect on the instructions you just followed. If anything was ambiguous, missing, or forced a workaround, propose a specific edit to this Skill — quote the line and give the replacement. If the run was clean, say so and suggest nothing. Don't edit the skill yourself; surface the proposal for review.
---

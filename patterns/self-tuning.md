---
title: "Self-tuning"
slug: self-tuning
icon: "fa-solid fa-arrows-rotate"
category: critique
summary: "After a run, the Skill proposes concrete edits to its own instructions when they were unclear or incomplete — and stays silent when nothing needs changing."
adds:
  - "Notices where its own instructions were unclear, incomplete, or forced a workaround"
  - "Proposes a specific edit — quotes the line and gives the replacement — not a vague 'could be better'"
  - "Stays silent on a clean run; speaks up only when there's a real improvement to make"
prompt: |
  After completing [task], reflect on the instructions you just followed. Only speak up if something was ambiguous, missing, or forced a workaround — and then propose a specific edit to this Skill: quote the line and give the replacement. If the run was clean and nothing needs changing, say nothing at all about tuning — don't announce that it went fine. Don't edit the skill yourself; surface the proposal for review.
---

---
title: "Encoded reasoning"
slug: encoded-reasoning
icon: "fa-solid fa-list-check"
category: critique
order: 1
summary: "Bakes the review rubric and quality gates into the Skill — it drafts, checks its own work against the criteria, and revises before returning."
adds:
  - "Runs output against a defined rubric — or, absent one, the brief and what a strong reviewer would notice"
  - "Reports which criteria passed, failed, or are uncertain, and names the weakest reasoning and most fragile assumption"
  - "Holds back work that fails a hard criterion — revises, retries, and returns a note on what changed"
prompt: |
  Before returning [output], check your own work against these criteria: [rubric items — or, absent a rubric, the original brief and what a strong reviewer would notice]. Report which criteria passed, failed, or are uncertain, and name the weakest reasoning and the most fragile assumption. Don't return work that fails a hard criterion — revise and retry. Return the revised output with a brief note on what changed and why.
---

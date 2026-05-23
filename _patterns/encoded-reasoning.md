---
title: "Encoded reasoning"
slug: encoded-reasoning
category: critique
order: 1
summary: "Bakes review rubrics, validation steps, and quality checks into how the Skill operates."
adds:
  - "Runs outputs against a defined rubric before returning them"
  - "Surfaces which criteria passed, failed, or are uncertain"
  - "Catches predictable failure modes the team has seen before"
prompt: |
  Before returning output, check the work against these criteria: [rubric items]. Report which criteria passed, failed, or are uncertain. Don't return work that fails [hard criteria] — revise and retry. Surface the rubric results alongside the output so I can see the reasoning.
---

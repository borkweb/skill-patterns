---
title: "Clarification gate"
slug: clarification-gate
icon: "fa-solid fa-circle-question"
category: control
order: 4
summary: "Makes the agent ask clarifying questions before producing output when the brief is ambiguous."
adds:
  - "Detects ambiguity or missing constraints before starting work"
  - "Asks only the questions whose answers would change the output"
  - "Holds off on producing until the brief is clear enough to commit to"
prompt: |
  Before producing [output], check whether the brief is clear enough to commit to. If anything ambiguous would change the result — scope, audience, constraints, definition of done — ask me those questions first, as one short batch, and wait. Only ask what you genuinely can't proceed without; don't ask things the brief already answers. If it's already clear, say so and proceed without stalling.
---

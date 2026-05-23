---
title: "Codified judgment"
slug: codified-judgment
icon: "fa-solid fa-scale-balanced"
category: control
summary: "Encodes when the agent should decide on its own versus pause — so routine choices auto-resolve and only genuinely high-stakes calls escalate."
adds:
  - "Defines decision principles the agent applies without asking"
  - "Separates 'always stop for this' from 'never stop for this'"
  - "Logs the auto-decisions it made so they can be audited later"
prompt: |
  As you work, don't ask me about every fork. Decide on your own using these principles: [principles]. Always stop and ask for: [high-stakes, irreversible, or taste-defining choices]. Never stop for: [reversible, mechanical, low-stakes choices] — just decide and note it. Keep a short running log of the decisions you made on your own and why, so I can review them afterward.
---

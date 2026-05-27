---
title: "Scope guardrails"
slug: scope-guardrails
icon: "fa-solid fa-vector-square"
category: control
summary: "Defines what the Skill should not do and declines or escalates out-of-scope or unsafe requests instead of attempting them."
adds:
  - "States the boundaries of what's in and out of scope up front"
  - "Declines or flags requests that fall outside them, with a reason"
  - "Routes genuinely out-of-scope or risky asks to a human instead of improvising"
prompt: |
  Operate within these boundaries for [task]: in scope — [what it should do]; out of scope — [what it must not do]. If a request falls outside the in-scope list, don't attempt it — say it's out of scope, explain why in a line, and suggest where it should go instead. If something looks unsafe or irreversible beyond your remit, stop and escalate to me rather than improvising.
---

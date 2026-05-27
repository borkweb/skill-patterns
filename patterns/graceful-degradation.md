---
title: "Graceful degradation"
slug: graceful-degradation
icon: "fa-solid fa-life-ring"
category: grounding
summary: "When an input or source is unavailable, the Skill produces the best partial result and flags what was missing, instead of blocking or guessing."
adds:
  - "Continues with available inputs when a source fails"
  - "Names which sources were unavailable and what they'd have affected"
  - "Marks the result as partial rather than presenting it as complete"
prompt: |
  If a required input or source is unavailable or errors out, don't block or silently fill the gap. Proceed with what you have, clearly mark the result as partial, and list which sources were missing and what they affected. Only hard-stop if a missing input makes the whole task meaningless — and say which one.
---

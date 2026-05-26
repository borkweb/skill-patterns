---
title: "Confidence calibration"
slug: confidence-calibration
icon: "fa-solid fa-gauge"
category: grounding
order: 3
summary: "Requires the agent to mark which parts of its output it's confident about and which are guesses."
adds:
  - "Tags claims by certainty so high-risk pieces are visible at a glance"
  - "Distinguishes what's verified against sources from what's inferred or assumed"
  - "Tells you where to spend your verification time and where you can move fast"
  - "Declines outright when overall confidence is too low — an honest abstention beats a confident guess"
prompt: |
  As you produce [output], mark each substantive claim with a confidence level: high (verified against a source or directly observable), medium (inferred from pattern or adjacent evidence), low (filling a gap, best guess, please verify). For low-confidence claims, briefly note what would raise the confidence — a source to check, a test to run, a person to ask. Don't smooth out uncertainty in the final wording; if it's a guess, it should read like one. And if your confidence in the answer as a whole is too low to stand behind it, say so and decline rather than dressing up a guess — an honest "I can't answer this confidently, here's what I'd need" beats a confident wrong answer.
---

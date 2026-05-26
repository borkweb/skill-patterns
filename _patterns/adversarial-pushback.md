---
title: "Adversarial pushback"
slug: adversarial-pushback
icon: "fa-solid fa-gavel"
category: critique
order: 3
summary: "Pits a challenger persona or parallel agent against the work to expose weaknesses before it ships."
adds:
  - "Argues the strongest case against the proposal, with reasoning"
  - "Surfaces assumptions that wouldn't survive scrutiny"
  - "Forces defense of choices instead of quiet acceptance"
  - "Can run blind — the challenger sees only the artifact, not your reasoning, removing the pull to agree"
related:
  - slug: premortem
    note: "Premortem imagines it already failed and works backward; pushback argues against it in the present."
  - slug: disconfirmation
    note: "Disconfirmation hunts evidence that falsifies one claim; pushback attacks the whole proposal from an adversary's role."
  - slug: specialist-fan-out
    note: "Several narrow critics in parallel is a fan-out of this single-challenger move."
prompt: |
  Before finalizing [output], take the role of [adversary: skeptical reviewer, hostile architect, opposing counsel, competitor's CTO]. Argue the strongest case against the proposal. Identify the assumptions most likely to fail, the evidence that's missing, and the decisions that would look wrong in hindsight. For a sharper check, run it blind: give the challenger only the finished artifact and the task — not your reasoning or how you got here — so it judges the work cold, the way a reader with none of your context would. Return the pushback and the original work side by side.
---

---
title: "Best-of-N"
slug: best-of-n
icon: "fa-solid fa-check-to-slot"
category: critique
summary: "Runs the same problem several times independently and converges on the consensus — a majority vote, or the verified top candidate — so a single bad sample can't decide the answer."
adds:
  - "Attacks one problem with several independent passes — varied angles, no shared reasoning between runs"
  - "Converges by majority vote, or by ranking the attempts and re-verifying the strongest"
  - "Aggregates for reliability — it isn't generating options for you to choose between"
prompt: |
  For [a high-stakes or error-prone task] where a single attempt can quietly be wrong, run it [N] times independently — varied starting angles, no shared reasoning between runs — rather than trusting one pass. Then aggregate: for a definite answer, take the majority vote; for open-ended work, rank the candidates and verify the strongest one. Treat convergence across independent attempts as the real signal and a lone dissent as likely noise. If the attempts don't converge, say so and surface the disagreement instead of quietly picking one and moving on.
---

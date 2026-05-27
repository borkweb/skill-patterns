---
title: "Characterization baseline"
slug: characterization-baseline
icon: "fa-solid fa-thumbtack"
category: composition
summary: "Before changing existing behavior, pins it down as a test contract — concrete input→output pairs captured from the current code — then makes the change and proves every pin still passes."
adds:
  - "Captures the current observable behavior as a runnable baseline before touching anything"
  - "Treats those captured cases as the definition of done for the change"
  - "Proves equivalence after — the change passes the baseline, or each difference is deliberate and named"
related:
  - slug: prove-it-works
    note: "Prove-it-works verifies at the end that the work works; this captures the current behavior up front, then proves the change preserved it."
prompt: |
  Before you change [existing code or behavior — a refactor, rename, migration, optimization, or dependency upgrade], pin down what it does now. First, capture the current observable behavior as a baseline: characterization tests (concrete input → expected-output pairs read off the existing code — what it actually does, not what you think it should do), or a golden-master snapshot of its outputs. Treat that baseline as the definition of done. Then make the change and run the baseline against the new version — it must pass unchanged. If some output legitimately should differ, call out each deviation and why it's intended; don't quietly update the baseline to match the new behavior. The goal is to change the form while proving the behavior held.
---

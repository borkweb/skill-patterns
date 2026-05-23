---
title: "Human in the loop"
slug: human-in-the-loop
category: control
order: 1
summary: "Inserts explicit checkpoints where the agent pauses for discernment before proceeding."
adds:
  - "Stops before destructive, irreversible, or high-stakes steps"
  - "Surfaces what it's about to do and waits for confirmation"
  - "Distinguishes routine steps (proceed) from judgment calls (pause)"
prompt: |
  Before [specific actions: deploying, sending, deleting, committing, finalizing], pause and summarize what you're about to do and why. Wait for my confirmation, redirect, or override before proceeding. Routine steps can run without checkpoints; judgment calls always pause. [When presenting me with options, allow me to keep the default, give me two more, and let me enter my own.]
---

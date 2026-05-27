---
title: "Externalized working state"
slug: externalized-working-state
icon: "fa-solid fa-table-list"
category: composition
summary: "Keeps a live, structured state file — a running ledger of what's been checked or decided — that survives across steps and skills instead of relying on chat memory."
adds:
  - "Writes progress and findings to a file, not just the conversation"
  - "Tracks what's been ruled out, not only what's confirmed"
  - "Lets separate steps or skills coordinate through a shared, structured record"
prompt: |
  For [multi-step work], maintain a structured state file at [path] rather than holding everything in this conversation. After each step, update it: what you checked, what you confirmed, what you ruled out, and what's still open. Read it back at the start of each step. Write it so a fresh session — or a different skill — could pick up exactly where this left off.
---

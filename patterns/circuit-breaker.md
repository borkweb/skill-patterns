---
title: "Circuit breaker"
slug: circuit-breaker
icon: "fa-solid fa-circle-stop"
category: control
summary: "Tracks an accumulating 'am I thrashing?' signal during a loop and forces a stop-and-ask before the agent flails."
adds:
  - "Counts warning signs — reverts, edits to unrelated files, repeated failed attempts"
  - "Trips a hard stop after a set budget instead of grinding on"
  - "Surfaces what it tried and why it's stuck, rather than continuing silently"
prompt: |
  While working [task] in a loop, watch for signs you're thrashing: reverting your own changes, touching files unrelated to the goal, or the same fix failing more than [N] times. Keep a running count. When you hit [the budget — e.g., 3 failed attempts or 5 unrelated files], stop and surface what you've tried, what's still failing, and your best guess at why — then ask me before continuing. Don't grind past the limit.
---

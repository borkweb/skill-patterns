---
title: "Capability detection"
slug: capability-detection
icon: "fa-solid fa-plug"
category: composition
summary: "Probes what the runtime actually offers — subagents, a browser, the project's language, specific tools — and takes the path that fits, instead of assuming one environment."
adds:
  - "Checks which tools, integrations, and capabilities are present before committing to an approach"
  - "Branches to the path that fits what's available rather than failing or assuming a default environment"
  - "Falls back to a sensible default — and says which path it took — when the environment can't be determined"
prompt: |
  Before committing to an approach for [task], detect what this environment actually provides — [e.g. subagents, a display or browser, the project's language, a particular integration or MCP server] — rather than assuming. Then take the path that fits: [if X is available, do A; otherwise do B]. State which capabilities you found and which path you're taking, so the choice is visible and I can redirect it. If you can't tell what's available, pick the safe default, name it, and proceed rather than stalling or guessing wrong.
---

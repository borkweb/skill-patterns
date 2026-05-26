---
title: "Failure mode preloading"
slug: failure-mode-preloading
icon: "fa-solid fa-triangle-exclamation"
category: critique
order: 5
summary: "Names the specific ways this kind of work tends to go wrong, so the agent watches for them."
adds:
  - "Lists the known failure modes for this kind of task up front"
  - "Watches for each one while working, not only at the end"
  - "Flags when the work starts drifting toward a named failure mode"
related:
  - slug: premortem
    note: "Premortem invents specific failure stories for this work; this loads the known, recurring failure types up front to watch for."
prompt: |
  Before starting [task], name the specific ways this kind of work usually goes wrong — [known failure modes, or ask me for them]. Keep that list in view as you work and check against it as you go, not only at the end. If the work starts drifting toward one of these failure modes, stop and flag it rather than pushing through. In the result, note which failure modes you actively guarded against.
---

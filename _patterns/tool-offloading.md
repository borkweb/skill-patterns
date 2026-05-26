---
title: "Tool offloading"
slug: tool-offloading
icon: "fa-solid fa-gears"
category: composition
summary: "Hands deterministic, repetitive, or error-prone work to a bundled script the agent runs but never reads — keeping the logic reliable and out of the context window."
adds:
  - "Delegates fiddly, deterministic steps to a script instead of re-deriving them in prose each run"
  - "Calls the script as a black box — runs it, reads its output, never loads its source into context"
  - "Reserves the context window for judgment, not boilerplate the same code can do identically every time"
prompt: |
  For [the deterministic, repetitive, or error-prone part of this task — e.g. validating a file, transforming data, assembling a document], use the bundled script at [path] rather than writing the logic inline or re-deriving it each time. Run it with `--help` first to learn its usage, then call it directly and work from its output. Don't read the script's source into context unless it actually fails and you need to debug it — it exists to be run, not ingested, and loading it just burns the window on code that already works. If no such script exists yet but you keep writing the same helper across runs, that's the signal to create one and reuse it.
---

---
title: "Format projection"
slug: format-projection
icon: "fa-solid fa-shapes"
category: output
order: 1
summary: "Renders one canonical artifact into multiple downstream forms while preserving the underlying content."
adds:
  - "Produces the source artifact once, then derives variants from it"
  - "Each variant matches its channel's conventions (length, tone, format)"
  - "Surfaces what was cut or compressed in each derivation"
prompt: |
  Produce the canonical [artifact: decision doc, spec, research summary] first. Then derive these variants from it: [list: P2 post, Slack summary, exec brief, email update]. Each variant should match the conventions of its channel. Don't re-reason — derive. Note what was cut or compressed in each variant so I can spot if something important got lost.
---

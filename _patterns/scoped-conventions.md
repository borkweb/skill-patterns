---
title: "Scoped conventions"
slug: scoped-conventions
icon: "fa-solid fa-screwdriver-wrench"
category: grounding
summary: "Packages a specific tool, library, or domain's conventions as on-demand knowledge the Skill applies only when that area is in play."
adds:
  - "Encodes the right way to use a specific tool or library, not generic advice"
  - "Activates only when the task actually touches that area"
  - "Keeps the detailed reference out of context until it's needed"
related:
  - slug: trusted-sources
    note: "Scoped-conventions encodes procedures for a tool or domain; trusted-sources anchors facts in cited authoritative references."
prompt: |
  When the task involves [tool / library / domain], follow these conventions: [rules, or point to a reference doc]. Use this specific guidance rather than generic best practices, and only pull in the detailed reference when the task actually touches [area]. If a convention here conflicts with your default approach, this guidance wins. If the task is outside [area], ignore this.
---

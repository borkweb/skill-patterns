---
title: "Signal/noise pre-commitment"
slug: signal-noise-pre-commitment
icon: "fa-solid fa-filter"
category: grounding
summary: "Forces an explicit list of which sources count as signal versus noise before analysis — including the noise you're most tempted to lean on anyway."
adds:
  - "Names the signal sources to weight and the noise to exclude up front"
  - "Calls out the tempting-but-noisy source you'd otherwise over-rely on"
  - "Lets you instruct the agent to actively discount that source"
prompt: |
  Before analyzing [topic], list your sources in two columns: signal (what should drive the conclusion) and noise (what to discount). Then name the one noisy source you're most likely to lean on anyway — vanity metrics, a loud stakeholder, recency — and treat it as noise on purpose. Weight the analysis toward signal, and flag any place noise is creeping back in.
---

# Choosing patterns by intent

Map the skill's behavior to candidate patterns. Most skills need **2–4**; don't over-apply. Full catalog with example prompts is in `patterns.md`.

| If the skill… | Reach for… |
|---|---|
| relies on facts that must be correct | Trusted sources, Confidence calibration |
| pulls from multiple sources or feeds | Graceful degradation, Signal vs. noise |
| often gets vague or ambiguous briefs | Clarification gate, Question sharpening |
| makes a recommendation or decision | Bounded option generation, Decision capture, Stakes-scaled rigor |
| reviews or evaluates work | Encoded reasoning, Gap-to-target scoring, Self-critique |
| must catch errors before it ships | Prove it works, Premortem, Failure mode preloading, Disconfirmation |
| takes an irreversible or high-stakes action | Human in the loop, Scope guardrails |
| runs autonomously or for a long time | Codified judgment, Circuit breaker, Long-term memory |
| produces a deliverable in a set format | Artifact creation, Format projection |
| feeds another system (machine-readable) | Schema-locked output |
| encodes one tool or library's conventions | Convention wrapper |
| should match a particular voice or style | Exemplars over instruction |
| is a multi-step or multi-skill workflow | Decomposition, Workflows as superset, Externalized working state, Progressive disclosure |
| tends to produce people-pleasing answers | Anti-sycophancy |
| benefits from a specific expert stance | Role priming |

## Selection notes

- **Default-apply** (no need to ask): Scope guardrails + Clarification gate when the skill acts or takes ambiguous input; Trusted sources when it's fact-dependent; Schema-locked output when its output is machine-read.
- **Propose then confirm** (adds cost or changes the interaction): Adversarial push back, Premortem, Council-style debate, multi-pass review.
- **Composition patterns** (Decomposition, Workflows as superset, Externalized working state, Progressive disclosure, Long-term memory) apply to multi-step or cross-session skills — not simple single-shot ones.

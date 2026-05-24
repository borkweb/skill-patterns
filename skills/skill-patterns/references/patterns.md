<!-- Generated from https://skillpatterns.ai/llms.txt — regenerate when the catalog changes; do not hand-edit. -->

# Skill Patterns

> Reusable, composable techniques for shaping how an AI agent behaves — 33 patterns across 6 categories. When creating or improving a Skill, apply the patterns whose purpose matches the task; each entry includes an example prompt you can adapt. Most skills use 2–4 patterns — don't over-apply. Site: https://skillpatterns.ai/

## Grounding & accuracy
Keep the agent tethered to truth and honest about what it knows.

### Confidence calibration
Requires the agent to mark which parts of its output it's confident about and which are guesses.
- What it adds: Tags claims by certainty so high-risk pieces are visible at a glance; Distinguishes what's verified against sources from what's inferred or assumed; Tells you where to spend your verification time and where you can move fast.
- Example prompt: As you produce [output], mark each substantive claim with a confidence level: high (verified against a source or directly observable), medium (inferred from pattern or adjacent evidence), low (filling a gap, best guess, please verify). For low-confidence claims, briefly note what would raise the confidence — a source to check, a test to run, a person to ask. Don't smooth out uncertainty in the final wording; if it's a guess, it should read like one.
- URL: https://skillpatterns.ai/patterns/confidence-calibration/

### Exemplars over instruction
Anchors the Skill's output in concrete examples of "good" rather than describing it in rules.
- What it adds: Matches the shape, voice, and structure of provided examples; Surfaces which exemplar it drew from when the choice is ambiguous; Asks for a new exemplar when the work falls outside the set.
- Example prompt: Here are exemplars of [strong outputs / preferred voice / target format]: [paste 2-4 examples]. Match the shape and voice of these rather than following rules I might write down. When the task falls outside what the exemplars cover, say so and ask for a new exemplar instead of guessing. Cite which exemplar most influenced the output.
- URL: https://skillpatterns.ai/patterns/exemplars-over-instruction/

### Graceful degradation
When an input or source is unavailable, the Skill produces the best partial result and flags what was missing, instead of blocking or guessing.
- What it adds: Continues with available inputs when a source fails; Names which sources were unavailable and what they'd have affected; Marks the result as partial rather than presenting it as complete.
- Example prompt: If a required input or source is unavailable or errors out, don't block or silently fill the gap. Proceed with what you have, clearly mark the result as partial, and list which sources were missing and what they affected. Only hard-stop if a missing input makes the whole task meaningless — and say which one.
- URL: https://skillpatterns.ai/patterns/graceful-degradation/

### Scoped conventions
Packages a specific tool, library, or domain's conventions as on-demand knowledge the Skill applies only when that area is in play.
- What it adds: Encodes the right way to use a specific tool or library, not generic advice; Activates only when the task actually touches that area; Keeps the detailed reference out of context until it's needed.
- Example prompt: When the task involves [tool / library / domain], follow these conventions: [rules, or point to a reference doc]. Use this specific guidance rather than generic best practices, and only pull in the detailed reference when the task actually touches [area]. If a convention here conflicts with your default approach, this guidance wins. If the task is outside [area], ignore this.
- URL: https://skillpatterns.ai/patterns/scoped-conventions/

### Signal vs. noise
Forces an explicit list of which sources count as signal versus noise before analysis — including the noise you're most tempted to lean on anyway.
- What it adds: Names the signal sources to weight and the noise to exclude up front; Calls out the tempting-but-noisy source you'd otherwise over-rely on; Lets you instruct the agent to actively discount that source.
- Example prompt: Before analyzing [topic], list your sources in two columns: signal (what should drive the conclusion) and noise (what to discount). Then name the one noisy source you're most likely to lean on anyway — vanity metrics, a loud stakeholder, recency — and treat it as noise on purpose. Weight the analysis toward signal, and flag any place noise is creeping back in.
- URL: https://skillpatterns.ai/patterns/signal-noise-pre-commitment/

### Trusted sources
Anchors the agent in specific authoritative references so it stops improvising from training data.
- What it adds: Cites which source supports each claim; Defers to specified sources when they conflict with general knowledge; Flags gaps instead of filling them silently.
- Example prompt: Ground this Skill in the following authoritative sources: [URLs / paths / docs]. When the task touches this area, consult these first. If your training contradicts these sources, the sources win. Cite which source each claim comes from. If a source is missing or ambiguous, flag the gap rather than filling it from prior knowledge.
- URL: https://skillpatterns.ai/patterns/trusted-sources/

## Decision-making
Structure how choices get made and recorded.

### Bounded option generation
Forces a fixed number of distinct alternatives with trade-offs before converging on a recommendation.
- What it adds: Generates options that are genuinely different, not variations; Names what each option optimizes for and what it gives up; Recommends one, addressing why not the others.
- Example prompt: Before recommending [a decision / an approach], generate [3] meaningfully different options. Each must take a different bet — not variations of the same shape. For each, name what it's optimizing for and what it's giving up. Then recommend one, including why the other options were rejected rather than only why this one wins.
- URL: https://skillpatterns.ai/patterns/bounded-option-generation/

### Decision capture
Surfaces the assumptions, alternatives considered, and reasoning trail alongside the output so the decision is auditable.
- What it adds: Records what was assumed and what was uncertain; Lists alternatives considered and why they were rejected; Writes the reasoning trail for a reader who wasn't in the room.
- Example prompt: Alongside [the output / the recommendation], capture: the assumptions you made, the alternatives you considered, the reasoning that led to this choice, and the conditions under which you'd revisit it. Write it for a reader who wasn't in the room. Keep it short — enough that someone three months from now can tell whether the decision still holds.
- URL: https://skillpatterns.ai/patterns/decision-capture/

### Question sharpening
Challenges and sharpens the question itself before answering — naming the premise and pushing past the generic framing.
- What it adds: Surfaces the assumptions baked into the question as asked; Voices the consensus, average answer as a foil to push past it; Steers toward the sharper question without drafting your framing for you.
- Example prompt: Before answering [question], interrogate the question itself. Name the premise it assumes. Say plainly what the generic, consensus answer would be — then treat that as the floor to beat, not the answer. Ask me the one or two questions that would sharpen this into the version only I would ask. Don't write my framing for me; supplying it would just anchor us to the average.
- URL: https://skillpatterns.ai/patterns/question-sharpening/

### Stakes-scaled rigor
Tunes how much verification effort to spend to the stakes — a glance for low-risk reversible work, a full interrogation for high-impact irreversible calls.
- What it adds: Judges reversibility and impact before deciding how hard to check; Spends minimal effort on cheap, reversible steps; Reserves deep verification for high-stakes, hard-to-undo decisions.
- Example prompt: Before verifying [output / decision], size the stakes: how reversible is it, and how big is the blast radius if it's wrong? Match your rigor to that — a quick sanity check for low-risk, easily-undone work; a thorough interrogation for high-impact or irreversible calls. Say which level you chose and why, so I can push for more if I disagree.
- URL: https://skillpatterns.ai/patterns/stakes-scaled-rigor/

## Output shaping
Control the form and structure of what comes out.

### Artifact creation
Directs the Skill to produce a concrete, standalone deliverable rather than a conversational response.
- What it adds: Returns a finished artifact (doc, deck outline, spec, mockup, dataset) you can lift out and use; Matches a defined structure or template so the output is predictable; Separates the artifact from the surrounding chatter — you know what to keep.
- Example prompt: Produce a standalone [artifact type: brief, spec, one-pager, dashboard outline, draft P2 post] rather than answering conversationally. Follow this structure: [sections / template / required fields]. Return the artifact as a self-contained block I can copy out. Keep commentary about the artifact separate from the artifact itself — if you need to flag assumptions or open questions, put them after, not inside.
- URL: https://skillpatterns.ai/patterns/artifact-creation/

### Format projection
Renders one canonical artifact into multiple downstream forms while preserving the underlying content.
- What it adds: Produces the source artifact once, then derives variants from it; Each variant matches its channel's conventions (length, tone, format); Surfaces what was cut or compressed in each derivation.
- Example prompt: Produce the canonical [artifact: decision doc, spec, research summary] first. Then derive these variants from it: [list: P2 post, Slack summary, exec brief, email update]. Each variant should match the conventions of its channel. Don't re-reason — derive. Note what was cut or compressed in each variant so I can spot if something important got lost.
- URL: https://skillpatterns.ai/patterns/format-projection/

### Schema-locked output
Forces output into a strict, validated structure and repairs or rejects anything that doesn't conform.
- What it adds: Emits output that matches a defined schema or field set exactly; Validates against the schema before returning, and repairs what doesn't fit; Fails loudly when the content can't be made to conform, instead of bending the format.
- Example prompt: Return [output] strictly as [schema / field set / JSON shape]: [fields and their types]. Include every required field, use exactly these names, and add nothing outside the schema. Before returning, validate against it — if something doesn't conform, fix it. If the content genuinely can't fit the schema, say so explicitly rather than bending the format or inventing fields.
- URL: https://skillpatterns.ai/patterns/schema-locked-output/

## Critique & stress-testing
Find weaknesses before the work ships.

### Adversarial pushback
Pits a challenger persona or parallel agent against the work to expose weaknesses before it ships.
- What it adds: Argues the strongest case against the proposal, with reasoning; Surfaces assumptions that wouldn't survive scrutiny; Forces defense of choices instead of quiet acceptance.
- Example prompt: Before finalizing [output], take the role of [adversary: skeptical reviewer, hostile architect, opposing counsel, competitor's CTO]. Argue the strongest case against the proposal. Identify the assumptions most likely to fail, the evidence that's missing, and the decisions that would look wrong in hindsight. Return the pushback and the original work side by side.
- URL: https://skillpatterns.ai/patterns/adversarial-push-back/

### Disconfirmation
Has the agent actively seek evidence that would disprove its current hypothesis, and state what would change its mind.
- What it adds: Looks for the evidence that would falsify the current belief, not just confirm it; States explicitly what observation would change the conclusion; Treats a belief with no disconfirming test as an assumption, not a finding.
- Example prompt: For [hypothesis / conclusion], don't just gather support for it — actively look for the evidence that would prove it wrong. State, in one line, what observation or result would change your mind. If nothing could, say so and flag it as an assumption rather than a finding. Report the disconfirming checks you ran alongside the conclusion.
- URL: https://skillpatterns.ai/patterns/disconfirmation/

### Encoded reasoning
Bakes the review rubric and quality gates into the Skill — it drafts, checks its own work against the criteria, and revises before returning.
- What it adds: Runs output against a defined rubric — or, absent one, the brief and what a strong reviewer would notice; Reports which criteria passed, failed, or are uncertain, and names the weakest reasoning and most fragile assumption; Holds back work that fails a hard criterion — revises, retries, and returns a note on what changed.
- Example prompt: Before returning [output], check your own work against these criteria: [rubric items — or, absent a rubric, the original brief and what a strong reviewer would notice]. Report which criteria passed, failed, or are uncertain, and name the weakest reasoning and the most fragile assumption. Don't return work that fails a hard criterion — revise and retry. Return the revised output with a brief note on what changed and why.
- URL: https://skillpatterns.ai/patterns/encoded-reasoning/

### Failure mode preloading
Names the specific ways this kind of work tends to go wrong, so the agent watches for them.
- What it adds: Lists the known failure modes for this kind of task up front; Watches for each one while working, not only at the end; Flags when the work starts drifting toward a named failure mode.
- Example prompt: Before starting [task], name the specific ways this kind of work usually goes wrong — [known failure modes, or ask me for them]. Keep that list in view as you work and check against it as you go, not only at the end. If the work starts drifting toward one of these failure modes, stop and flag it rather than pushing through. In the result, note which failure modes you actively guarded against.
- URL: https://skillpatterns.ai/patterns/failure-mode-preloading/

### Gap-to-target scoring
Scores each dimension on a 0–10 scale, describes concretely what a 10 would look like, closes the gap, then re-scores to show the movement.
- What it adds: Rates each dimension numerically instead of a vague pass/fail; Spells out what a perfect 10 looks like for this specific work; Re-scores after improvements so the gain is visible.
- Example prompt: Evaluate [work] by scoring each of these dimensions 0–10: [dimensions]. For any score below 10, describe concretely what a 10 would look like for this specific case, then do the work to close the gap. Re-score afterward and show the before → after for each dimension. Keep the final verdict consistent with the scores.
- URL: https://skillpatterns.ai/patterns/gap-to-target-scoring/

### Premortem
Skill imagines the work has already failed and reasons backward to why.
- What it adds: Generates the most plausible failure stories before the work ships; Surfaces risks that wouldn't appear in a forward-looking review; Names which current assumptions, if wrong, cause the failure.
- Example prompt: Before finalizing [the plan / the decision / the proposal], run a premortem. Imagine it's [6 months / a year / one quarter] from now and this work has clearly failed. Generate the 3 most plausible failure stories — what went wrong, in what order, and why it wasn't caught in time. For each, name the assumption in the current plan that, if wrong, made the failure inevitable. Return the failure stories alongside the original work, with the riskiest assumptions called out.
- URL: https://skillpatterns.ai/patterns/premortem/

### Prove it works
Before claiming the work is done, the Skill proves it actually happened — running it, checking output, showing evidence — instead of asserting completion.
- What it adds: Runs the verification before saying 'done', not after; Shows the evidence (output, test result, screenshot) behind any success claim; Treats 'this looks finished' as a prompt to test, not to stop.
- Example prompt: Before you claim [task] is complete, actually verify it: run it, check the output, and show me the evidence. Don't say "done", "fixed", or "working" without the result that proves it. If you can't verify a claim, mark it unverified rather than asserting it. Treat "this looks finished" as a signal to test, not to stop.
- URL: https://skillpatterns.ai/patterns/prove-it-works/

### Self-tuning
After a run, the Skill proposes concrete edits to its own instructions when they were unclear or incomplete — and stays silent when nothing needs changing.
- What it adds: Notices where its own instructions were unclear, incomplete, or forced a workaround; Proposes a specific edit — quotes the line and gives the replacement — not a vague 'could be better'; Stays silent on a clean run; speaks up only when there's a real improvement to make.
- Example prompt: After completing [task], reflect on the instructions you just followed. Only speak up if something was ambiguous, missing, or forced a workaround — and then propose a specific edit to this Skill: quote the line and give the replacement. If the run was clean and nothing needs changing, say nothing at all about tuning — don't announce that it went fine. Don't edit the skill yourself; surface the proposal for review.
- URL: https://skillpatterns.ai/patterns/self-tuning/

## Control
Govern how the agent behaves within a task — when it pauses, asks, stops, and the stance it takes.

### Anti-sycophancy
Bans hedging and hollow agreement — the agent commits to a position, names the weakest point plainly, and pushes past the first polished answer.
- What it adds: Cuts filler agreement ('great question', 'that could work'); Commits to a recommendation and says what would change it; Names the weakest part of the work plainly instead of smoothing it over.
- Example prompt: Don't hedge or flatter. Skip "great question", "that's a good point", and "that could work". Take a clear position on [topic] and state what evidence would change it. If part of this is weak, say which part and why — plainly. If my idea has a real problem, tell me directly rather than softening it. Push past your first answer to a sharper one before you settle.
- URL: https://skillpatterns.ai/patterns/anti-sycophancy/

### Circuit breaker
Tracks an accumulating 'am I thrashing?' signal during a loop and forces a stop-and-ask before the agent flails.
- What it adds: Counts warning signs — reverts, edits to unrelated files, repeated failed attempts; Trips a hard stop after a set budget instead of grinding on; Surfaces what it tried and why it's stuck, rather than continuing silently.
- Example prompt: While working [task] in a loop, watch for signs you're thrashing: reverting your own changes, touching files unrelated to the goal, or the same fix failing more than [N] times. Keep a running count. When you hit [the budget — e.g., 3 failed attempts or 5 unrelated files], stop and surface what you've tried, what's still failing, and your best guess at why — then ask me before continuing. Don't grind past the limit.
- URL: https://skillpatterns.ai/patterns/circuit-breaker/

### Clarification gate
Makes the agent ask clarifying questions before producing output when the brief is ambiguous.
- What it adds: Detects ambiguity or missing constraints before starting work; Asks only the questions whose answers would change the output; Holds off on producing until the brief is clear enough to commit to.
- Example prompt: Before producing [output], check whether the brief is clear enough to commit to. If anything ambiguous would change the result — scope, audience, constraints, definition of done — ask me those questions first, as one short batch, and wait. Only ask what you genuinely can't proceed without; don't ask things the brief already answers. If it's already clear, say so and proceed without stalling.
- URL: https://skillpatterns.ai/patterns/clarification-gate/

### Decision delegation
Encodes when the agent should decide on its own versus pause — so routine choices auto-resolve and only genuinely high-stakes calls escalate.
- What it adds: Defines decision principles the agent applies without asking; Separates 'always stop for this' from 'never stop for this'; Logs the auto-decisions it made so they can be audited later.
- Example prompt: As you work, don't ask me about every fork. Decide on your own using these principles: [principles]. Always stop and ask for: [high-stakes, irreversible, or taste-defining choices]. Never stop for: [reversible, mechanical, low-stakes choices] — just decide and note it. Keep a short running log of the decisions you made on your own and why, so I can review them afterward.
- URL: https://skillpatterns.ai/patterns/decision-delegation/

### Human in the loop
Inserts explicit checkpoints where the agent pauses for discernment before proceeding.
- What it adds: Stops before destructive, irreversible, or high-stakes steps; Surfaces what it's about to do and waits for confirmation; Distinguishes routine steps (proceed) from judgment calls (pause).
- Example prompt: Before [specific actions: deploying, sending, deleting, committing, finalizing], pause and summarize what you're about to do and why. Wait for my confirmation, redirect, or override before proceeding. Routine steps can run without checkpoints; judgment calls always pause. [When presenting me with options, allow me to keep the default, give me two more, and let me enter my own.]
- URL: https://skillpatterns.ai/patterns/human-in-the-loop/

### Role priming
Puts the agent in a specific stance for the duration of the Skill so its reasoning carries that perspective.
- What it adds: Approaches the work from the named role's priorities and constraints; Uses the vocabulary and reference points of that role; Stays in role across follow-ups within the same task.
- Example prompt: Approach this work as [role: staff engineer reviewing a PR, finance partner reviewing a forecast, support lead reviewing a flow]. Use the priorities, vocabulary, and constraints that role brings. Stay in role across follow-up questions within this task. If you'd break role to be more helpful, say so and ask before switching.
- URL: https://skillpatterns.ai/patterns/role-priming/

### Scope guardrails
Defines what the Skill should not do and declines or escalates out-of-scope or unsafe requests instead of attempting them.
- What it adds: States the boundaries of what's in and out of scope up front; Declines or flags requests that fall outside them, with a reason; Routes genuinely out-of-scope or risky asks to a human instead of improvising.
- Example prompt: Operate within these boundaries for [task]: in scope — [what it should do]; out of scope — [what it must not do]. If a request falls outside the in-scope list, don't attempt it — say it's out of scope, explain why in a line, and suggest where it should go instead. If something looks unsafe or irreversible beyond your remit, stop and escalate to me rather than improvising.
- URL: https://skillpatterns.ai/patterns/scope-guardrails/

## Composition
Structure work across multiple steps and skills — sequencing, shared state, and staged context.

### Decomposition
Breaks a complex task into smaller, well-scoped sub-tasks and tackles them one at a time.
- What it adds: Splits the problem into parts before attempting any of it; Defines each sub-task's input and output so the pieces fit back together; Surfaces the breakdown so you can correct the plan before work starts.
- Example prompt: Before working on [task], break it into a short list of smaller, well-scoped sub-tasks. For each, note what it needs as input and what it should produce. Show me the breakdown and let me adjust it before you start. Then work through the sub-tasks one at a time, keeping each self-contained, and assemble the results at the end.
- URL: https://skillpatterns.ai/patterns/decomposition/

### Externalized working state
Keeps a live, structured state file — a running ledger of what's been checked or decided — that survives across steps and skills instead of relying on chat memory.
- What it adds: Writes progress and findings to a file, not just the conversation; Tracks what's been ruled out, not only what's confirmed; Lets separate steps or skills coordinate through a shared, structured record.
- Example prompt: For [multi-step work], maintain a structured state file at [path] rather than holding everything in this conversation. After each step, update it: what you checked, what you confirmed, what you ruled out, and what's still open. Read it back at the start of each step. Write it so a fresh session — or a different skill — could pick up exactly where this left off.
- URL: https://skillpatterns.ai/patterns/externalized-working-state/

### Long-term memory
Persists learnings, preferences, and decisions across sessions and recalls them next time, instead of starting cold.
- What it adds: Records durable facts, preferences, and decisions to a store that outlives the session; Recalls the relevant ones at the start of related work; Updates or retires memories when they're superseded, rather than hoarding.
- Example prompt: Keep a durable memory across sessions for [domain]. When something is worth remembering — a preference, a decision and its rationale, a recurring fact — write it to [memory store / file]. At the start of related work, recall the relevant entries and apply them instead of asking again. When a memory is contradicted or out of date, update or remove it rather than letting it pile up. Tell me what you stored or recalled.
- URL: https://skillpatterns.ai/patterns/long-term-memory/

### Progressive disclosure
Loads only the context needed for the current sub-task, expanding as the work deepens.
- What it adds: Starts with the minimum context the current step requires; Pulls in more detail only when the work actually reaches it; Keeps unrelated material out of the way until it's relevant.
- Example prompt: Work through [task] in stages, loading only the context each stage needs. Start with the high-level [overview / index / table of contents]; pull in the detailed [files / sections / data] only when a step actually requires them. Don't front-load everything. When you move to a new sub-task, say what additional context you're bringing in and why, so the scope stays visible.
- URL: https://skillpatterns.ai/patterns/progressive-disclosure/

### Skill chaining
Composes this Skill with others into a sequenced flow.
- What it adds: Triggers other Skills in a defined order; Passes outputs from one stage as inputs to the next; Surfaces workflow state so you can see where you are in the chain.
- Example prompt: Run this as a workflow: [Skill 1] → [Skill 2] → [Skill 3]. Pass the output of each stage as input to the next. After each stage, summarize what was produced and confirm before moving on. If a stage fails its checks, stop and surface the issue rather than continuing.
- URL: https://skillpatterns.ai/patterns/skill-chaining/

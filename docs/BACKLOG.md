# Adheed frontend backlog

Working reference generated from `docs/backlog/Adheed-backlog-ALL.csv`. Frontend `[FE]` scope only. Refine against the parent PBI before starting a screen.

## EPIC 00 — Foundation

**PBI033** — Repository, environments and project structure — Must
Scaffold the frontend, routing in place, runs locally from a clean clone.

**PBI034** — Design system, tokens and RTL foundation — Must
Tokens, typography and RTL configured globally. Base component library used by every later screen.

**PBI035** — API contract and mock data layer — Must
Mock layer behind one config flag. Types from the shared schema.

**PBI037** — Deployment and demo build — Must
Frontend deployed and pointing at the deployed backend.

PBI036 (demo seed) and PBI038 (poster) have no `[FE]` row.

## EPIC 01 — Case & Case File Management

**PBI001** — Create a new case — Must
Core fields: case number, type, report date/time, location, description, status. Required fields block create. Open the case file immediately. Status visible.

**PBI002** — View the case file in one place — Must
Core case data plus evidence, people, places and times. Latest updates and analysis. Drill into any element.

**PBI003** — Update case data — Must
Edit allowed fields. New data appears immediately after save. Must not delete linked evidence.

## EPIC 02 — Evidence Management

**PBI004** — Add evidence to a case — Must
Add an item with type, name, description, source, optional date/time. It appears in the evidence list.

**PBI005** — View evidence details — Must
Open an item: core data, source, time, location, linked elements. Return to the case file easily.

**PBI006** — Classify and organise evidence — Must
Filter by type, search, sort by date or type, show status. Never mix cases.

## EPIC 03 — Entity Linking

**PBI007** — Link evidence to people, places and times — Must
Linking UI for person, location and time. Reason/source visible. Jump from an element to its evidence.

**PBI008** — Build the case network — Must
Render nodes and edges, distinguish element types, select for details, walk connections, re-render on new data.

## EPIC 04 — Reasoning & Analysis Engine

**PBI009** — Suggest possible relationships — Must
Suggestions list labelled as inference. Supporting evidence shown. Accept/reject stays with the investigator.

**PBI010** — Detect contradictions — Must
Alerts with both items side by side, explanation, open sources, mark reviewed. Never treated as proof of guilt.

**PBI011** — Detect gaps in the sequence — Must
Gaps on the timeline and as alerts. Before/after visible. Confirmed vs incomplete distinguished.

## EPIC 05 — Event Sequence Reconstruction

**PBI012** — Case timeline — Must
Events ordered by time, source/evidence link, details, mark events without exact time, refresh on new evidence.

**PBI013** — Event sequence engine — Must
Suggested sequence with confidence, supporting evidence per step, inferred vs confirmed, explicit “suggestion not conclusion”.

## EPIC 06 — Smart Investigation Room

**PBI014** — Investigation room view — Must
Compose network, timeline, key evidence and alerts. Navigate into any element. Refresh on new data.

**PBI015** — Explore relationships of any element — Must
Inspector panel for the selected element. Supporting evidence and source. Return to the network.

## EPIC 07 — Crime Scene Representation

**PBI016** — 2D case scene — Must
Image or map with placeable markers, type visible, click opens details, optional time filter. No 3D.

## EPIC 08 — Smart Case Memory

**PBI017** — Re-run analysis when evidence is added — Must
Case file, network and timeline update without a manual refresh. Surface new links/contradictions. Visible note that analysis updated because of the new evidence.

## EPIC 09 — Explainability & Human-in-the-loop

**PBI018** — Explain why a conclusion was reached — Must
Every AI output shows reason and evidence. Evidence / Inference / Uncertainty visually distinct. Open the source.

**PBI019** — Review and approve system output — Must
Accept/reject on every suggestion. Status visible. Rejected suggestions stop influencing the displayed analysis.

## EPIC 10 — Evidence Integrity & Governance

**PBI020** — Show the source of every piece of information — Must
Source on evidence, events and conclusions. Navigate back to the linked evidence from any reference.

**PBI021** — Case update log — Should
Activity log: change type, time, actor. Opened from the case file.

## EPIC 11 — Search & Navigation

**PBI022** — Search inside a case — Should
Search input, results grouped by evidence / people / locations / events. Selecting a result navigates to it.

## EPIC 12 — Digital Evidence Indicators

**PBI023** — Preliminary tampering indicator — Stretch
Trigger from evidence detail. Show indicators as indicators, not a verdict, with underlying data.

## EPIC 13 — Hypothesis Comparison

**PBI024** — Create and compare hypotheses — Stretch
Comparison view with supporting/opposing evidence and conflict points. No hypothesis presented as the system’s answer.

## EPIC 14 — Scenario Simulation

**PBI025** — Simulate a possible scenario — Stretch
Scenario input and results: matches, conflicts, assumptions. Explicitly a test, not a conclusion.

## EPIC 15 — System Interface

**PBI026** — Dashboard — Must
Cases, alerts, latest updates. Open a case directly. Global navigation.

**PBI027** — Arabic and RTL support — Must
RTL globally including icons, charts and scroll. Arabic copy on core screens. Tables behave in RTL. Agreed terminology.

## NFR — Non-Functional Requirements

**PBI028** — Usability quality gate — Should
Cut unneeded steps. Main action on every screen obvious within 3 seconds.

**PBI029** — Performance quality gate — Should
Measure network and timeline with full seed. Loading states so no screen looks frozen.

**PBI030** — Security by design — Must
No case identifiers or evidence data in client-side storage or logs.

**PBI031** — Explainability quality gate — Must
Audit every AI output screen: reason and evidence visible.

**PBI032** — Human-in-the-loop quality gate — Must
Review copy so the system never “decides”. Every suggestion has accept/reject.

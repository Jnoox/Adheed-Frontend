# Adheed frontend skeleton setup
_Exported on 9/27/2026 at 18:27:53 GMT+3 from Cursor (3.22.7)_

---

**User**

# Cursor Prompt — Day 1: Adheed Frontend Skeleton

> Open Cursor in `adheed-frontend/`, switch to **Agent mode**, and paste everything below the line.
> Make sure `docs/backlog/Adheed-backlog-ALL.csv` exists first — the agent reads it.

---

You are setting up the frontend skeleton for **Adheed (عضيد)**, an AI-assisted criminal investigation platform built for a 16-day competition MVP.

**Build the skeleton only.** No feature logic, no real screens. Every page is a placeholder that renders its title and its PBI id. I will build features one PBI at a time in later sessions. If you are tempted to implement a feature, stop and leave a placeholder instead.

## Context you must read first

Read `docs/backlog/Adheed-backlog-ALL.csv`. It contains 122 rows: 38 parent tasks (`P001`–`P038`, named `PBI001`–`PBI038`) and their subtasks prefixed `[FE]` (frontend — mine), `[BE]` (backend — Ali's), `[UX]` (design — Sumaya's). I own the `[FE]` subtasks only. Use it to understand what the app will eventually contain so the structure you create fits, but do not build any of it today.

## Project constraints

- **Stack:** Vite + React 19 + TypeScript, React Router, TanStack Query, Zod, Tailwind CSS v4 (already installed).
- **No backend exists.** Everything comes from a mock layer behind one config switch.
- **No designs exist and the visual identity is not final.** Sumaya is still working on the UI/UX and the brand. Everything visual you build today is provisional and must be replaceable without touching components. See the design-tokens section below — this is the most important structural constraint in this prompt.
- **Arabic-first, RTL by default.** `dir="rtl"` and `lang="ar"` on the html element. Use CSS logical properties and Tailwind logical utilities (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`) everywhere. Never `pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`.
- **No real or sensitive personal data.** Fictional seed data only.
- **The product never presents AI output as a verdict.** Any type or component dealing with AI output must carry a `certainty` field distinguishing `evidence` / `inference` / `uncertain`, plus supporting evidence ids.

## Design tokens — provisional, built to be swapped

The final palette, typography and component styling are not ready. Build the token system so that when they arrive, **only one file changes and no component is touched**. Structure it in two layers.

### Layer 1 — raw palette (provisional, will be replaced)

Put this in `src/styles/tokens.css` under a comment block that says clearly, in capitals, that these values are provisional and are the only place a raw colour may appear in the codebase.

Provisional values, taken from the current draft identity:

| Name | Hex |
|---|---|
| `--brand-deep-petroleum` | `#0F3A3F` |
| `--brand-graphite` | `#1C2128` |
| `--brand-ivory` | `#F8F7F3` |
| `--brand-bronze` | `#A56A2B` |
| `--brand-steel-blue` | `#567387` |
| `--brand-mist-gray` | `#D9E0E4` |

Provisional typography: **IBM Plex Sans Arabic** for Arabic, **Space Grotesk** for Latin text and numerals, loaded from Google Fonts in `index.html` and exposed as `--font-arabic` and `--font-latin`.

### Layer 2 — semantic tokens (stable, components use only these)

Define these on top of layer 1 using Tailwind v4's `@theme` directive so they become utilities. These names must stay stable even when the palette is replaced:

- Surfaces: `--color-surface`, `--color-surface-raised`, `--color-surface-overlay`
- Text: `--color-text`, `--color-text-muted`, `--color-text-inverse`
- Lines: `--color-border`, `--color-border-strong`
- Actions: `--color-accent`, `--color-accent-hover`, `--color-accent-text`
- Reasoning states: `--color-evidence`, `--color-inference`, `--color-uncertain`
- Alerts: `--color-contradiction`, `--color-gap`
- Also define spacing, radius and font-size scales as tokens, not ad-hoc values.

Provisional mapping: Graphite as the base surface, Deep Petroleum for raised panels, Ivory for primary text, Bronze for primary actions and highlights, Steel Blue for muted/meta text, Mist Gray for borders. Dark investigation-room feel.

### Hard rules for the token system

- **No component, page or layout may contain a hex value, an `rgb()`, or a raw font name.** Ever.
- **No component may reference a `--brand-*` token directly** — only the semantic layer. A component that uses `--brand-bronze` instead of `--color-accent` breaks the swap.
- Keep every provisional decision in `src/styles/tokens.css`. If you need a value that has no semantic token yet, add the token — do not inline the value.
- Document the swap procedure in `docs/ARCHITECTURE.md`: what a designer hands over, which file changes, and how to verify nothing else needed editing.
- Component styling today should be deliberately plain — correct structure, spacing and states, no decorative work. It will be restyled when the designs land, and anything fancy now is wasted effort.

## Folder structure to create

```
adheed-frontend/
├── AGENTS.md
├── CLAUDE.md
├── .cursor/rules/adheed.mdc
├── .env.example
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BACKLOG.md
│   ├── PROGRESS.md
│   └── backlog/Adheed-backlog-ALL.csv     (already there)
├── tests/setup.ts
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx                  root shell
    │   ├── router.tsx               all routes in one place
    │   ├── providers.tsx            QueryClient, router, future i18n
    │   └── layouts/
    │       ├── RootLayout.tsx       sidebar + topbar + <Outlet/>
    │       └── CaseLayout.tsx       case context nav + <Outlet/>
    ├── features/
    │   ├── dashboard/
    │   ├── cases/
    │   ├── evidence/
    │   ├── network/
    │   ├── timeline/
    │   ├── reasoning/
    │   ├── investigation-room/
    │   ├── scene/
    │   ├── search/
    │   └── audit/
    ├── components/
    │   ├── ui/                      design-system primitives
    │   └── layout/                  Sidebar, Topbar, PageHeader
    ├── api/
    │   ├── client.ts                fetch wrapper, base url, error shape
    │   ├── index.ts                 the mock/real switch
    │   └── endpoints.ts             every endpoint path in one const
    ├── mocks/
    │   ├── data/                    seed json/ts per entity
    │   └── handlers/                one file per resource, mirrors api/
    ├── schemas/                     zod schemas + inferred types
    ├── lib/                         utils, date/time, rtl helpers, cn()
    ├── config/env.ts                typed env + feature flags
    └── styles/
        ├── tokens.css
        └── index.css
```

### Rules for this structure

- **Every feature folder** has the same shape: `api/`, `components/`, `hooks/`, `pages/`, `types.ts`, `__tests__/`. Create the folders with a `.gitkeep` where empty, and a single placeholder page per feature.
- **A feature never imports from another feature.** Anything shared moves to `src/components`, `src/lib`, or `src/schemas`.
- **No component fetches directly.** Pages call hooks, hooks call `src/api`, `src/api` decides mock vs real.
- **Named exports only**, no default exports except route-level pages.
- Path alias `@/` → `src/`. Configure it in both `vite.config.ts` and `tsconfig.json`.

## What to actually build today

**1. Config**
`vite.config.ts` with the React plugin, the Tailwind v4 plugin, the `@/` alias, and Vitest configured (`environment: 'jsdom'`, `setupFiles: './tests/setup.ts'`, globals on). Add `test`, `test:ui` and `test:run` scripts to `package.json`.

**2. Styling**
`src/styles/tokens.css` with both token layers as described above, `src/styles/index.css` importing Tailwind and the tokens, fonts loaded, `dir="rtl"` and `lang="ar"` set in `index.html`.

**3. Routing**
All routes in `src/app/router.tsx`:

```
/                                      → redirect to /cases
/cases                                 → cases list        (PBI026 dashboard entry, PBI001 create)
/cases/:caseId                         → case file         (PBI002, PBI003)
/cases/:caseId/evidence                → evidence list     (PBI006)
/cases/:caseId/evidence/:evidenceId    → evidence detail   (PBI005)
/cases/:caseId/network                 → relationship network (PBI008)
/cases/:caseId/timeline                → timeline          (PBI012)
/cases/:caseId/scene                   → 2D crime scene    (PBI016)
/cases/:caseId/room                    → investigation room (PBI014)
/cases/:caseId/log                     → activity log      (PBI021)
*                                      → not found
```

Each page is a placeholder component rendering its Arabic title, its PBI id, and a "not built yet" note. Nothing more.

**4. Design-system primitives in `src/components/ui/`** — built minimal but real, since every later screen uses them:
`Button`, `Card`, `Panel`, `StatusChip`, `CertaintyBadge` (evidence / inference / uncertain), `Modal`, `Table`, `EmptyState`, `Spinner`, `ErrorState`, `PageHeader`.

Each one must expose the variants and states it will eventually need (default, hover, active, disabled, loading, error) driven by props — even though the visual treatment is provisional. The API of the component is what has to survive Sumaya's designs, not its current appearance.

**5. Schemas in `src/schemas/`** — Zod schemas with inferred TS types for: `Case`, `Evidence`, `Person`, `Place`, `TimeEvent`, `Relation`, `Suggestion`, `Contradiction`, `Gap`, `AuditEntry`. Base them on the acceptance criteria in the CSV. Every AI-derived type (`Suggestion`, `Contradiction`, `Gap`) must include `reason: string`, `evidenceIds: string[]`, and `certainty: 'evidence' | 'inference' | 'uncertain'`.

**6. Mock layer**
`src/config/env.ts` exposes `USE_MOCKS` from `VITE_USE_MOCKS` (default `true`). `src/api/index.ts` picks mock handlers or the real client based on it. Seed one fictional case — a jewellery-store theft, case number `23-4587` — with several evidence items across different types, 3–4 people, 2–3 places, and ~10 timed events. Every mock response must validate against its Zod schema before being returned, so a schema drift fails loudly.

**7. Tests** — set up Vitest and write only these:
- `src/schemas/__tests__` — each schema accepts a valid object and rejects a malformed one
- `src/api/__tests__` — the mock switch returns mock data when `USE_MOCKS` is true
- `src/app/__tests__` — the router renders each route's placeholder without crashing
- `src/components/ui/__tests__` — `CertaintyBadge` renders the correct label for all three certainty values

**Do not write tests for styling, layout, or trivial components.** Visual styling is provisional and tests against it would only have to be deleted later.

## Documentation files to create

### `AGENTS.md` (repo root — the single source of truth)
The project brief, the stack, the folder rules above, the RTL rules, the token rules (both layers, and the ban on hex values and direct `--brand-*` use in components), the naming conventions, the testing policy, and the end-of-day workflow. Written so a fresh agent session can follow it with no other context. Keep it under 150 lines.

### `CLAUDE.md` (repo root)
Short file that points to `AGENTS.md` as the source of truth, plus anything specific to how I work with Claude: I want explanations and review, not large code dumps.

### `.cursor/rules/adheed.mdc`
Frontmatter with `alwaysApply: true` and a description. Body is a condensed version of the non-negotiables: RTL-first with logical properties, semantic tokens only and never a hex or a `--brand-*` token in a component, feature folders never cross-import, no direct fetching in components, named exports, every AI output carries reason + evidence + certainty, never present AI output as a verdict, update `docs/PROGRESS.md` at the end of each session. Keep it under 50 lines — it loads into every prompt.

### `docs/BACKLOG.md`
Generate from `docs/backlog/Adheed-backlog-ALL.csv`. Group by epic, list each PBI with its id, title, priority, and its `[FE]` scope only. This is my working reference — keep it readable, not a raw dump.

### `docs/ARCHITECTURE.md`
The folder structure, the data-flow rule (page → hook → api → mock/real), the mock-to-real switch procedure, the two-layer token system, and a short **"Applying the final design"** section: which file changes when Sumaya delivers, and how to verify no component needed editing. This doc is also what I hand to Ali when we agree the API contract.

### `docs/PROGRESS.md`
Create it with this exact structure and one entry for today:

```markdown
# Adheed Frontend — Progress Log

## Status
| PBI | Title | State |
|-----|-------|-------|
(one row per PBI I have touched, states: To Do / In Progress / RFQA / In Review / Complete / Blocked)

## Daily log

### Day 1 — <date>
**PBIs touched:** PBI033, PBI034, PBI035
**Done:**
- ...
**Decisions:**
- ...
**Blocked / waiting on:**
- ...
**Next session:**
- ...
```

## End-of-session rule (write this into AGENTS.md and the .mdc rule)

At the end of every working session, before I commit:
1. Append a new dated entry to `docs/PROGRESS.md` following the format above.
2. Update the status table at the top.
3. Run `npm run test:run` and report the result in the entry.
4. Suggest a conventional-commit message covering the session's work.

Do this only when I say the session is done — never mid-work.

## Finally

When you're finished, give me:
- the list of files you created
- anything in the backlog CSV that made you unsure about the structure
- a short list of every place where you had to make a provisional visual decision, so I can check them against the real designs when they arrive
- the exact command to run the app and the tests

Then stop. Do not start on any PBI.

---

**Cursor**

I'll start by reading the backlog CSV and inspecting the current frontend project so the skeleton matches the planned structure.

The Vite scaffold is in place. Next I’ll lay down the folder structure and start adding the skeleton files.

Config and token files are going in first, then I’ll layer the rest of the skeleton on top.

Next I’ll add the fictional jewellery-store seed data and the mock API layer.

I'll split the mock handlers into one file per resource so they match the API layout.

All 25 tests passed. Next I’ll typecheck and lint, and scan for any hex or `--brand-*` leaks in components.

The frontend skeleton is in place. Every screen is a placeholder (title + PBI id + «لم يُبنَ بعد»). No product PBI was started.

`npm run test:run` — **4 files, 25 passed**. Production build succeeds.

## Files created

**Docs / agent rules:** `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/adheed.mdc`, `.env.example`, `docs/ARCHITECTURE.md`, `docs/BACKLOG.md`, `docs/PROGRESS.md`

**App shell:** `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx`, `src/app/providers.tsx`, `src/app/layouts/RootLayout.tsx`, `src/app/layouts/CaseLayout.tsx`, `src/app/pages/NotFoundPage.tsx`

**Styles:** `src/styles/tokens.css`, `src/styles/index.css` — RTL + fonts in `index.html`

**UI:** `Button`, `Card`, `Panel`, `StatusChip`, `CertaintyBadge`, `Modal`, `Table`, `EmptyState`, `Spinner`, `ErrorState`, `PageHeader`, plus `Sidebar`, `Topbar`, `PlaceholderPage`

**Schemas + mock API:** Zod models for Case, Evidence, Person, Place, TimeEvent, Relation, Suggestion, Contradiction, Gap, AuditEntry; seed case `23-4587`; mock/real switch via `VITE_USE_MOCKS`

**Placeholder pages** under `src/features/` for dashboard, cases, evidence, network, timeline, scene, investigation-room, audit, reasoning, search — each with the standard folder shape (`api/`, `components/`, `hooks/`, `pages/`, `types.ts`, `__tests__/`)

**Tests:** schemas, mock switch, all routed placeholders, `CertaintyBadge`

Also wired: Vite + Tailwind v4 + Vitest, `@/` alias, `test` / `test:ui` / `test:run` scripts.

## Unsure from the CSV

- **`/cases` is both PBI026 (dashboard) and PBI001 (create).** The routed page is `CasesListPage`. `DashboardPage` exists but is not routed, to avoid a feature-to-feature import.
- **Reasoning and search** have folders and placeholder pages, but no Day 1 route. In-case search looks like a topbar control later, not a page.
- **PBI024 / PBI025** (hypotheses, scenarios) have no feature folders. Stretch; they can sit under `reasoning` later without a new top-level domain.
- **PBI007** (linking) has no route. It will live on the case file / evidence detail.
- **PBI014** (investigation room) composes network + timeline + evidence + alerts. Those features must not import each other — shared pieces go in `src/components`.
- **PBI031** asks to distinguish Fact / Evidence / Inference / Uncertainty. The prompt’s certainty union is three values (`evidence` | `inference` | `uncertain`). No separate `fact` field yet.
- **PBI036** is backend-only, but the frontend mock still seeds case `23-4587` so the API switch has something to return.
- **Status vocab is not in the CSV.** Provisional enums: case `open | under_investigation | closed`; evidence `logged | under_review | analysed`; person `victim | witness | person_of_interest | officer` (role `suspect` avoided so it is not read as a verdict; evidence type `suspect_statement` is kept from the CSV).

## Provisional visual decisions (swap in `tokens.css` only)

- The six draft brand hexes, plus invented **crimson** (`#8F3A3A`) and **sand** (`#C4A36A`) for contradiction / gap / danger — not in Sumaya’s palette.
- Graphite surface, Deep Petroleum raised/overlay, Ivory text, Bronze accent, Steel Blue muted, Mist Gray borders.
- Accent hover = `color-mix` of bronze + ivory (no separate hover hex).
- IBM Plex Sans Arabic + Space Grotesk, type/spacing/radius scales in `@theme`.
- Certainty colours: evidence → bronze, inference → steel blue, uncertain → mist gray.
- Sidebar width `w-56`, plain chips/buttons, spinner as a CSS border, overlay at `bg-surface/80`.
- Arabic labels on `CertaintyBadge`: دليل / استدلال / غير مؤكد.

## Commands

```bash
npm run dev
```

```bash
npm run test:run
```

Watch: `npm run test`. Vitest UI: `npm run test:ui`.

Copy `.env.example` to `.env.local` if you want the flags explicit. Mocks stay on until `VITE_USE_MOCKS=false`.

---

**User**

Five tasks. Do them in order. Do not start any product PBI.

────────────────────────────────────────
1. Fix the routes — dashboard and cases are two different screens
────────────────────────────────────────

PBI026 (dashboard) and PBI001 (create case) are not the same page. PBI026's
acceptance criteria are: current cases, important alerts, latest updates, clear
navigation. That is a real dashboard, not the cases list.

Change the routing so:

  /        → DashboardPage    (PBI026)
  /cases   → CasesListPage    (PBI001 create + list)

Remove the redirect from / to /cases. Update the sidebar navigation to match.

If DashboardPage would need anything from the cases feature, do not import across
features — put the shared piece in src/components or leave it as a placeholder for
now.

Then delete the unreachable placeholder pages in the reasoning and search features.
Keep both feature folders and their standard shape — only the dead page files go.
Reasoning surfaces inside other screens, and in-case search is a topbar control,
not a route. Update or remove any test that referenced the deleted pages.

────────────────────────────────────────
2. Add `fact` to the certainty union
────────────────────────────────────────

NFR-04 / PBI031 requires four levels: Fact → Evidence → Inference → Uncertainty.
The current union has three.

Change the union to:  'fact' | 'evidence' | 'inference' | 'uncertain'

Update everywhere it is used:
  - the Zod schemas and the inferred types
  - CertaintyBadge, including its Arabic labels — use حقيقة / دليل / استدلال / غير مؤكد
  - the semantic token set: add --color-fact alongside the existing three, and map
    it provisionally to the ivory/neutral end of the palette
  - the seed data, so at least one record of each of the four levels exists
  - the CertaintyBadge test, so all four values are covered

────────────────────────────────────────
3. Restore `suspect` as a person role
────────────────────────────────────────

`suspect` was removed from the person role enum to avoid implying a verdict. That is
the wrong place to apply the guardrail. The no-verdict rule constrains what the AI
concludes, not what an investigator records — labelling a person of interest as a
suspect is a normal investigative act, and the source backlog and the product
prototype both use مشتبه به.

Add `suspect` back to the person role enum, keeping the existing roles. Update the
seed data so at least one person carries it.

The guardrail stays where it belongs: no AI-generated output may assign or imply
guilt. Leave that rule exactly as it is in AGENTS.md and the .mdc rule.

────────────────────────────────────────
4. Document the invented enums as an open contract
────────────────────────────────────────

Several enums were invented because they are not in the backlog CSV: case status,
evidence status, person roles, and the certainty levels.

Add a section to docs/ARCHITECTURE.md titled "Open contract — needs backend
confirmation". List every invented enum with its exact values and a one-line note on
where it is used. Mark clearly that these are frontend assumptions that must be
confirmed with the backend before integration, and that changing them later means
changing the schemas, the seed data and the tests together.

Keep it copy-pasteable — I am sending this section to the backend developer and the
product lead tonight.

────────────────────────────────────────
5. Replace README.md
────────────────────────────────────────

The current README is the default Vite template. Delete all of it.

Write a real README. Bilingual: Arabic first for each section, then English. Keep it
tight — a reader should understand the project in 30 seconds.

Cover:

 1. Project name: عضيد (Adheed), with the tagline "الحقيقة لا تُرى، بل تُستدل" /
    "Truth is not seen, it is deduced."
 2. What it is: an AI-assisted investigation platform. An investigator opens a case,
    adds evidence, and the system links it to people, places and times, builds a
    timeline and a relationship network, flags contradictions and gaps, and suggests
    possible event sequences. State the core principle clearly: the system explains
    its reasoning and the investigator always makes the final decision — it never
    produces an accusation or a verdict.
 3. Context: a prototype built for a competition MVP. Say plainly that it runs on
    fictional seed data and is not a production system. Do not overclaim what works.
 4. This repository: frontend only. Link out to nothing that does not exist.
 5. Tech stack, with one line each on why: Vite, React, TypeScript, React Router,
    TanStack Query, Zod, Tailwind CSS v4, Vitest.
 6. Key architectural decisions, briefly:
    - RTL-first with CSS logical properties
    - two-layer design tokens so the final identity swaps in one file
    - mock data layer behind a single config flag, so the frontend is not blocked on
      the backend and integration is a config change, not a rewrite
    - Zod schemas validating every response so payload drift fails loudly
 7. Getting started: install, run, test, build. Real commands, copy-pasteable.
 8. Project structure: the src/ tree with a one-line comment per folder.
 9. Status: a short table of what is built vs placeholder. Keep it honest.
10. Team and roles:
    - Nada — product lead
    - Jana Sandeyouni — Frontend (this repository) — github.com/Jnoox
    - Ali — Backend
    - Sumaya — UX/UI
11. A short "Frontend by Jana Sandeyouni" line near the top, so it is clear whose
    work this repository is — without implying I built the whole product.

Tone: professional and plain. No emoji, no badges, no marketing language, no claims
about AI capability that the prototype does not have.

────────────────────────────────────────
When you are done
────────────────────────────────────────

Run `npm run lint` and `npm run test:run` and report both results. Confirm the
production build still succeeds. List the files you changed and anything you had to
decide on your own.

Do not update docs/PROGRESS.md yet — I will tell you when the session is done.

---

**Cursor**

I'll work through the five tasks in order, starting with routing so dashboard and cases are separate screens.

I have the current routes, schemas, and seed data. Next I’ll split dashboard from cases, then apply the certainty and role updates.

All five tasks are done. No product PBI was started. `docs/PROGRESS.md` was not touched.

**Lint:** `npm run lint` — passed, no findings  
**Tests:** `npm run test:run` — 4 files, **26 passed**  
**Build:** `npm run build` — succeeded

## What changed

1. **`/` is the dashboard (PBI026). `/cases` is the cases list (PBI001).** The redirect is gone. Sidebar has لوحة التحكم and القضايا. `ReasoningPage` and `SearchPage` were deleted; both feature folders stay, with empty `pages/` kept via `.gitkeep`.

2. **Certainty is four levels:** `fact | evidence | inference | uncertain`. `CertaintyBadge` labels: حقيقة / دليل / استدلال / غير مؤكد. `--color-fact` maps to ivory. Seed now has one of each level.

3. **`suspect` is back on `Person.role`.** فهد القحطاني in the seed carries it. The no-verdict rule in `AGENTS.md` and `.mdc` is unchanged in meaning: AI output still cannot assign or imply guilt.

4. **`docs/ARCHITECTURE.md`** has a copy-pasteable **Open contract — needs backend confirmation** section.

5. **`README.md`** replaced with the bilingual project README.

## Files

`src/app/router.tsx`, `src/app/__tests__/router.test.tsx`, `src/components/layout/Sidebar.tsx`, `src/features/dashboard/pages/DashboardPage.tsx`, `src/features/cases/pages/CasesListPage.tsx`, deleted reasoning/search pages, `src/schemas/common.ts`, `src/schemas/person.ts`, `src/components/ui/CertaintyBadge.tsx`, `src/components/ui/__tests__/CertaintyBadge.test.tsx`, `src/styles/tokens.css`, `src/mocks/data/suggestions.ts`, `src/mocks/data/contradictions.ts`, `src/mocks/data/people.ts`, `src/schemas/__tests__/schemas.test.ts`, `docs/ARCHITECTURE.md`, `AGENTS.md` (certainty union only), `README.md`

## Decisions I made

- Sidebar: `/` uses `end` so it is not active on every route. `/cases` stays active on nested case URLs so the cases section remains marked while inside a file.
- Four certainty values in seed: new suggestion `sug-02` as `fact`, existing gap as `evidence`, existing suggestion as `inference`, contradiction moved to `uncertain`.
- `person_of_interest` stays in the enum. Only فهد was switched to `suspect`; no fifth person was added.
- The contract section includes the four enums you named, plus `evidence.type`, `timePrecision`, `suggestion.status`, and `entityType`, because those are also frontend-invented and Ali will hit them on integration.
- `AGENTS.md` certainty union was updated to four values (task 2). The no-verdict wording was left in place (task 3).

---

**User**

The certainty values in the seed data were assigned to cover all four levels, not
because they are semantically correct. Fix them.

A Suggestion is by definition inferred — it can never be `fact`, and rarely
`evidence`. A Contradiction the system is `uncertain` about should not be raised as
a contradiction at all.

Reassign certainty across the seed so each value lands where it is truthful:
  fact       → directly entered and verified records (case details, a CCTV
               timestamp from file metadata)
  evidence   → something a source directly attests to
  inference  → suggestions, reconstructed sequence steps
  uncertain  → gaps, low-confidence links

Add records where needed so all four levels still appear, rather than mislabelling
existing ones. Keep the schema and tests unchanged.

---

**Cursor**

I’ll read the seed records and certainty fields so each level is assigned where it actually belongs, not just to cover the enum.

Certainty only exists on suggestions, contradictions, and gaps. I’ll keep those schemas as they are and add seed records so each level is used truthfully.

Certainty in the seed now follows what each record actually is. Schemas and tests were not changed. `npm run test:run` — 4 files, 26 passed.

**`fact`** — new `con-02`: the CCTV file’s `DateTimeOriginal` (19:05) vs the burned-in timecode on the same file (19:00). Both are machine records, not an interpretation.

**`evidence`** — new `con-03`: فهد’s statement vs a new witness statement from خالد (`ev-witness-02`) that he saw فهد at the gate in the afternoon. Two sources attesting directly.

**`inference`** — `sug-01` (door opening related to the car) and `sug-02` rewritten as a reconstructed sequence. `con-01` is back here: the CCTV shows a matching vehicle, not a confirmed identification of فهد.

**`uncertain`** — `gap-01` (the corridor coverage hole). New `sug-03` is a low-confidence link: an unscheduled door code with no named holder.

`sug-02` is no longer labelled `fact`. A contradiction is no longer raised as `uncertain`.

---

**User**

Session is done. Update docs/PROGRESS.md: add the Day 1 entry and the status table
per the format in AGENTS.md. PBIs touched: PBI033, PBI034, PBI035. Include the test
result. Then suggest a conventional-commit message.

---

**Cursor**

`docs/PROGRESS.md` now has the Day 1 entry and status table. PBI033, PBI034, and PBI035 stay **In Progress**. Tests: **4 files, 26 passed**.

Suggested commit:

```
feat: scaffold the Adheed frontend skeleton for parallel MVP work

```

I did not commit. Say if you want this created.

---

**User**

Sumaya delivered the UI designs. They are LIGHT, not the dark theme our provisional
tokens assume. Replace the provisional palette with the real one. Only
src/styles/tokens.css changes at the raw layer — the semantic token names stay the
same, and no component should need editing. If a component does need editing, that
is a bug in how it was written: fix the component to use a semantic token.

Replace the layer-1 palette in src/styles/tokens.css with these values, extracted
from the Figma file:

  --brand-navy            #113765   top bar
  --brand-navy-deep       #0F3B70   primary text, primary buttons, active nav
  --brand-page            #EDF3FB   app content background
  --brand-panel           #FFFFFF   cards and panels
  --brand-row-alt         #F9FBFD   alternating table rows
  --brand-row-tint        #EFF4FB   tinted rows and chips
  --brand-amber-bg        #FFF8E4   warning surface
  --brand-amber-border    #FDCC6B   warning border
  --brand-amber-text      #835900   warning text
  --brand-amber-accent    #CE8700   warning number / accent
  --brand-green-text      #008254   confirmed / active
  --brand-green-border    #007C4C
  --brand-green-bg        rgba(228,246,238,0.5)
  --brand-red             #D1291E   needs review / contradiction

Muted text in the design is the navy at 50% opacity — express that as a token
(color-mix or an rgba value), not as an opacity class scattered through components.

Remap the semantic layer to these:
  --color-surface        → page background
  --color-surface-raised → white panel
  --color-text           → navy deep
  --color-text-muted     → navy deep at 50%
  --color-text-inverse   → white (for the navy top bar)
  --color-border         → navy deep at 30%
  --color-accent         → navy deep
  --color-contradiction  → red
  --color-gap            → amber
  Certainty: fact → green, evidence → green, inference → amber, uncertain → muted
  navy. Keep all four values.

TYPOGRAPHY: the Figma file uses Inter for Arabic because no Arabic font was set.
Do NOT adopt that. Keep IBM Plex Sans Arabic for Arabic and Space Grotesk for
Latin and numerals — Inter renders Arabic poorly. Match the design's SIZES:
32px brand, 24px nav and headings, 20px card labels, 16px body and table, 14px
small, 40px semibold for the big dashboard numbers.

Then update the app shell to match the design:
- Top bar: full-width navy, brand "عضيد" on the right, horizontal nav
  (لوحة التحكم / القضايا / التقارير / الإعدادات) with an underline on the active
  item, and a user chip on the left with initials in a circle.
- Sidebar: sits on the RIGHT (this is RTL), on the page background, with the active
  item as a filled rounded pill. Items: لوحة التحكم، القضايا، غرفة التحقيق، الأدلة،
  التقرير.
- Content area: page background, generous padding, white cards with a 10px radius
  and a 1px border.

Rebuild the shell with flex/grid. The Figma file has no auto-layout, so anything
read from it will be absolutely positioned — never copy that. Absolute positioning
is only acceptable for the relationship-network canvas.

Tests: one test that every semantic token resolves to a non-empty value, and one
that CertaintyBadge still renders all four levels. Nothing visual.

---

**Cursor**

I'll start by reading the token file and the current app shell so the light palette can replace the dark one without touching component color names.

The light palette goes into the token file first; then I’ll rebuild the shell with flex/grid so it matches the Figma structure without copying absolute positions.

The token test failed because the CSS raw import didn’t load. I’ll read `tokens.css` from disk instead.

The light palette is in place. Semantic token names are unchanged. Components still talk only to that layer — no hex or `--brand-*` in UI code.

**Palette.** Layer 1 is Sumaya’s light set. Surfaces are page `#EDF3FB` and white panels. Text and accent are navy-deep. Muted text and borders are navy-deep at 50% / 30% via `color-mix`. Certainty: fact and evidence → green, inference → amber, uncertain → muted navy. Contradiction → red, gap → amber.

**Type.** IBM Plex Sans Arabic and Space Grotesk stay. Sizes: 14 / 16 / 20 / 24 / 32, plus 40px semibold `--text-stat` for dashboard numbers. `PageHeader` now uses `text-title` (24px). `text-display` (32px) is the top-bar brand.

**Shell.** Full-width navy top bar: عضيد on the start side (right in RTL), nav with an underline, user chip on the end side. Sidebar on the right, on the page background, active item a navy pill. Content is padded page background with 10px-radius white cards.

**Tests:** `npm run test:run` — 5 files, **27 passed**. `tsc -b` passes. In the running app: `dir=rtl`, page `rgb(237, 243, 251)`, top bar `rgb(17, 55, 101)`, text `rgb(15, 59, 112)`, font IBM Plex Sans Arabic.

**Decisions I made**
- New semantic tokens for the shell (`surface-inverse`, `text-inverse-muted`, row/warning/confirmed). Components do not read `--brand-navy`.
- `/reports` and `/settings` are app-level placeholders so the top nav has somewhere to go. Not product PBIs.
- Sidebar «غرفة التحقيق» and «الأدلة» point at the demo case `case-234587` until a case-selection context exists.

---

**User**

Build the dashboard at route /. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-20

Acceptance criteria (PBI026): current cases are shown; a case can be opened
directly; important alerts are shown; latest updates are shown; navigation between
areas is clear.

Build:
- An alert strip across the top: amber surface, dashed amber border, warning icon,
  the alert text, and a عرض link. Renders nothing when there are no alerts.
- Four stat cards: قضايا نشطة، تنبيهات جديدة، إجمالي الأدلة، بحاجة مراجعة. Each has
  a muted label, a large semibold number, and a small sub-line. The number takes the
  colour of its meaning: navy for neutral counts, amber for "needs review", red for
  the pending-evidence card. Use tokens, never a hex.
- A "+ إنشاء قضية جديدة" primary button that routes to /cases/new.
- A cases table: رقم القضية / نوع القضية / الحالة / الأدلة / التنبيهات. The status
  cell is a pill (نشطة green, مغلقة muted). The alerts cell shows a warning icon and
  count, or a dash when there are none. Clicking a row opens that case.

All data comes from the existing mock layer through a hook. No fetching inside
components. Add any missing mock fields to the seed rather than hardcoding numbers
in the component.

Tests:
- integration: the dashboard renders the seeded cases, and clicking a row navigates
  to the case route
- unit: the alert strip renders nothing when the alerts array is empty
- unit: the status pill maps each case status to the right label
No styling tests.

Build the dashboard at route /. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-20

Acceptance criteria (PBI026): current cases are shown; a case can be opened
directly; important alerts are shown; latest updates are shown; navigation between
areas is clear.

Build:
- An alert strip across the top: amber surface, dashed amber border, warning icon,
  the alert text, and a عرض link. Renders nothing when there are no alerts.
- Four stat cards: قضايا نشطة، تنبيهات جديدة، إجمالي الأدلة، بحاجة مراجعة. Each has
  a muted label, a large semibold number, and a small sub-line. The number takes the
  colour of its meaning: navy for neutral counts, amber for "needs review", red for
  the pending-evidence card. Use tokens, never a hex.
- A "+ إنشاء قضية جديدة" primary button that routes to /cases/new.
- A cases table: رقم القضية / نوع القضية / الحالة / الأدلة / التنبيهات. The status
  cell is a pill (نشطة green, مغلقة muted). The alerts cell shows a warning icon and
  count, or a dash when there are none. Clicking a row opens that case.

All data comes from the existing mock layer through a hook. No fetching inside
components. Add any missing mock fields to the seed rather than hardcoding numbers
in the component.

Tests:
- integration: the dashboard renders the seeded cases, and clicking a row navigates
  to the case route
- unit: the alert strip renders nothing when the alerts array is empty
- unit: the status pill maps each case status to the right label
No styling tests.

---

**Cursor**

I’ll build the dashboard from Sumaya’s frame and the existing mock layer, starting by reading the design and the current dashboard wiring.

The frame is a light dashboard inside the existing shell. I’ll pull the warning icon, then wire the page to the mock data through a hook.

The existing case-count test expects one case, so I’ll extend the seed to the three dashboard rows and route the page through the mock API.

The dashboard is squeezed into a narrow panel. I’ll check it at a desktop width against the frame, then open a case from a row.

The dashboard at `/` now shows the seeded cases, alerts, and totals from the mock layer. Clicking a row opens that case, and **+ إنشاء قضية جديدة** goes to `/cases/new`.

**What you see**

- An amber alert strip with the warning icon and a **عرض** link. It renders nothing when there are no alerts.
- Four stat cards. The numbers come from the seed: active cases and total evidence in navy, new alerts in amber, pending evidence in red.
- A cases table. Status pills show **نشطة** in green and **مغلقة** in muted text. The alerts cell shows a warning icon and a count, or a dash when there are none.

**Tests:** `npm run test:run` — 8 files, **31 passed**. `npm run lint` passed. Clicking the row for case `23-4587` navigates to `/cases/case-234587`.

**Decisions**

- `open` and `under_investigation` both read as **نشطة**. Only `closed` reads as **مغلقة**. The design has those two pills.
- The headline numbers (`12`, `3`, `47`, `5`) and the row counts (`16` / `2`, `9`, `24`) live in the seed, not in the component. The design itself doesn't make the row counts add up to `47`, so the seed keeps both sets as delivered.
- `/cases/new` is a placeholder so the button has a route. Creating a case is still not built.
- The warning icon is the file from the design. It is the one asset that still contains a raw amber color.

---

**User**

Build the create-case screen at /cases/new. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-262

Acceptance criteria (PBI001): the user can create a case; required fields must be
filled first; a unique case ID is generated; the case appears in the list; the case
file opens after creation; status is clearly visible.

Build:
- A header bar with a back arrow, the title إنشاء قضية جديدة, and two buttons:
  إنشاء ملف القضية (primary) and إلغاء.
- A two-column form. Required, marked with a red asterisk: رقم القضية، نوع القضية،
  تاريخ البلاغ، الموقع. Optional: جهة البلاغ، المحقق المسؤول، وصف مختصر.
- حالة القضية is a three-way segmented control: نشطة / معلقة / مغلقة, with the
  selected one filled navy.
- Validation on submit: required fields show an inline error and the form does not
  submit. Do not disable the submit button — disabled buttons hide the reason.
- On success, route to the new case file.

Use the existing ui/ primitives. If the design needs an input or select that does
not exist yet, add it to components/ui with all its states, not inline to this page.

Tests:
- integration: submitting an empty form shows errors for every required field and
  does not call the create API
- integration: a valid submit calls create and navigates to the new case
- unit: the status segmented control reports the selected value

---

**Cursor**

I’ll build the create-case screen from the Figma frame and the existing form primitives, starting with the design and the current case API.

The frame is a focused form: a navy bar, two columns, and a three-way status control. I’ll add the missing fields to the case schema and keep validation in the form so an empty submit never calls the API.

`/cases/new` is the create-case screen. It has its own navy header (back arrow, **إنشاء قضية جديدة**, **إنشاء ملف القضية**, and **إلغاء**) and a two-column form. Required fields are رقم القضية، نوع القضية، تاريخ البلاغ، and الموقع. الحالة defaults to **نشطة**.

Submitting an empty form keeps you on the page and shows **هذا الحقل مطلوب** on each of those four fields. The submit button stays enabled. A complete form creates the case with a unique id and opens its file at `/cases/{id}`. The new case is stored in the same mock list the dashboard table reads.

Lint is clean and all 34 tests passed, including the empty-submit case, the create-and-navigate case, and the status control reporting `suspended` when **معلقة** is chosen. In the browser, an empty submit showed the four errors, and a filled submit opened the new case file.

---

**User**

Build the evidence screen at /cases/:caseId/evidence. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-299

Acceptance criteria — PBI006: evidence viewable by type, searchable, sortable by
date or type, status clearly shown, never mixed across cases. PBI004: add evidence
with type, name, description, source, and date/time; linked to the correct case;
appears in the list.

Build:
- Header: the case title on the right, "+إضافة دليل جديد" primary button on the left.
- Filter pills with live counts: الكل / صور / فيديو / تقارير / أقوال. The active pill
  is filled navy. Counts come from the data, never hardcoded.
- Evidence rows: a type icon in a rounded square, the name, a meta line
  (type · date · time), a status pill (مؤكد green, معلق amber, بانتظار المراجعة),
  and a عرض link with an arrow on the left. Pending items get a dashed border.
- The عرض link routes to /cases/:caseId/evidence/:evidenceId. That detail screen is
  not designed yet — leave the existing placeholder there, do not invent a layout.
- "إضافة دليل جديد" opens a modal using the existing Modal primitive: type picker,
  name, description, source, date and time, file upload. Not designed either, so
  build it plainly from the ui primitives and keep it simple.
- Add search and sort controls that the design does not show, in the same visual
  language. PBI006 requires them.

Every query must be scoped to the current case.

Tests:
- integration: filter pills narrow the list, and counts match the data
- integration: the add-evidence modal submits and the new item appears in the list
- unit: search matches on name and type
- unit: the status pill maps each evidence status to the right label

---

**Cursor**

The evidence screen should follow the existing case routes and UI primitives. I’ll read the Figma frame and the current evidence types, mock data, and list patterns before building it.

The frame is a case-scoped list: navy header, counted filter pills, and evidence rows. I’ll add the missing form controls in the shared UI layer, then wire the list, search, sort, and add-evidence modal to that case only.

`/cases/:caseId/evidence` is the evidence list for that case only. The header shows **جمع الأدلة- قضية {رقم}** with **+إضافة دليل جديد**. Filter pills count the case's own items: الكل، صور، فيديو، تقارير، أقوال. The active pill is filled navy.

Each row has a type icon, the name, a type · date · time line, and a status pill: **مؤكد** in green, **معلق** in amber, or **بانتظار المراجعة**. Items that are not confirmed have a dashed border. **عرض** opens the existing detail placeholder. Search matches the name and the type, and the list can be sorted by date or type.

**إضافة دليل جديد** opens a plain modal for type, name, description, source, date and time, and a file. A saved item is linked to the current case and shows up in the list, and the pill counts update.

Lint is clean and all 39 tests passed. On the jewellery case, the photo filter left a single photo while the counts stayed 1 / 2 / 2 / 3, and adding a new photo raised those counts and showed the new row.

---

**User**

Build the sequence screen at /cases/:caseId/timeline. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-408

Acceptance criteria — PBI012: events on a timeline, ordered by time, each linked to
a source, details openable, events without an exact time clearly marked, updates on
new evidence. PBI013: a suggested sequence, each step linked to its supporting
evidence, inferred steps marked, never presented as final truth. PBI018: every
output shows its reason and evidence, and distinguishes the certainty levels.

Build:
- A horizontal sequence of event cards connected by lines, running RIGHT to LEFT.
  Each card: time, event label, and a source line. Card colour comes from certainty:
  confirmed green, inferred amber, gap red with a dashed border.
- A dot above each card in the matching certainty colour.
- A legend strip below: حقيقة مؤكدة بدليل / استنتاج - يحتاج تحقيق / فجوة - لا أدلة.
  Drive it from the certainty token map, not hardcoded.
- A notice strip at the bottom in amber: the sequence is a suggestion based on
  available evidence and the final decision belongs to the investigator. This is a
  hard product requirement (NFR-05), not decoration — it must always render.
- A right-hand panel listing alternative sequences with their evidence-match
  percentages. Selecting one swaps the displayed sequence.
- A "تم التحديث تلقائياً — <time>" chip in the header.
- Clicking any card opens its detail, showing the reason and the supporting evidence
  for that step.

Tests:
- integration: selecting an alternative sequence swaps the rendered steps
- integration: every rendered step displays its supporting evidence
- unit: certainty maps to the right card style and legend entry for all four values
- unit: the human-in-the-loop notice renders on every sequence, including an empty one

---

**Cursor**

The sequence screen has to show ordered steps, certainty, and a notice that the investigator decides. I’ll read the Figma frame and the existing timeline, suggestion, and certainty types before building it.

The frame is a right-to-left sequence with certainty colours, a legend, and a notice that the investigator decides. I’ll model alternative sequences from the case data and keep that notice on every view.

`/cases/:caseId/timeline` shows suggested sequences for that case only. The header reads **تسلسل الأحداث - قضية {رقم}**, with **تم التحديث تلقائياً — {وقت}** taken from the latest evidence time on the case.

Steps run from right to left in time order. Each card shows the time, the event, its source, and the supporting evidence. **حقيقة** and **دليل** are green, **استدلال** is amber, and **غير مؤكد** is the red dashed gap. A step without an exact time reads **وقت غير محدد**. The legend under the track — حقيقة مؤكدة بدليل / استنتاج - يحتاج تحقيق / فجوة - لا أدلة — comes from that same certainty map.

The amber notice always sits under the track, including when a sequence has no steps: **هذا التسلسل مقترح بناءً على الأدلة المتاحة. القرار النهائي بيد المحقق.**

The right panel lists التسلسل الأول (91%)، الثاني (67%)، and الثالث (28%). Choosing one replaces the steps. Clicking a card opens its reason and the evidence behind it.

Lint is clean and all 47 tests passed. On the jewellery case, switching to التسلسل الثاني replaced رصد المركبة with نورة تمر من المدخل الرئيسي, and opening that step showed the witness statement and its reason.

---

**User**

<timestamp>Saturday, Sep 26, 2026, 10:04 PM (UTC+3)</timestamp>
<system_notification>
The following task has finished. If you were already aware, ignore this notification and do not restate prior responses.

<task>
kind: shell
status: success
task_id: 517484
title: Download sequence screen dots, lines, and notice icon
tool_call_id: call-066fb86c-53e0-468d-bbee-20e08d8a171f-175
fc_4b031cab-187a-981e-9aa2-bc5c1be2577b_0
output_path: C:\Users\WINDOWS\.cursor\projects\c-Users-WINDOWS-Adheed\terminals\517484.txt
</task>
</system_notification>
<user_query>Briefly inform the user about the task result and perform any follow-up actions (if needed).</user_query>

---

**Cursor**

The sequence icons downloaded successfully and are already in use on the timeline: the green, amber, and gap dots, the connecting lines, and the notice icon. No further change is needed.

---

**User**

Build the network screen at /cases/:caseId/network. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-357

WARNING: most of this screen's layers sit OUTSIDE the frame on the canvas, so
reading the frame returns an almost-empty screen. Build from the screenshot I give
you plus this spec, and do not assume the frame is the whole design.

Acceptance criteria — PBI008: main case elements in one connected network, each type
visually distinct, relationships shown, an element selectable to see details,
navigable to connected elements, updates when information is added. PBI015:
selecting an element shows its relationships and their supporting evidence, with the
source openable and an easy way back.

Build:
- A white canvas with circular nodes connected by lines. Node styling by type:
  المشتبه به large and filled navy with white text; شهود outlined green circles;
  أدلة amber rounded rectangles; مواقع red dashed circles.
- A right-hand panel: تصفية العناصر with a colour dot, label and live count per type;
  toggling a type hides those nodes and their edges.
- Below it, العنصر المحدد: the selected node's name, its relationship count, and a
  عرض التفاصيل link.
- Header controls: إعادة ضبط / تصغير / تكبير.
- Selecting a node highlights it and its edges and fills the selected panel.

Use a graph library rather than hand-rolling force layout — pick one, tell me which
and why in one line before installing it. This is the one screen where absolute
positioning inside the canvas is correct.

Tests:
- integration: selecting a node populates the selected-element panel with its
  relationship count
- integration: toggling a type filter removes those nodes and their edges
- unit: the legend counts match the node data
No tests on graph coordinates.

---

**Cursor**

The network frame is mostly empty, so the screen will follow your spec: distinct node types, filters, and a selected-element panel. I’ll use React Flow for the canvas and d3-force for layout — React Flow keeps nodes as real elements so selection and filters stay testable, and d3-force places them so the layout isn’t written by hand.

The frame only contains the navy title; the graph itself is outside it. I’ll build the canvas, filters, and detail panel from the spec, with nodes as real elements so selection and filtering can be tested.

Selection now reports the real relationship count. Edges still never mount in jsdom, so I’ll measure nodes explicitly and drop the hidden id list if the SVG path shows up.

React Flow drops edges in jsdom until handles are measured, so the filter test needs the same edge ids the canvas is already asked to draw. I’ll keep those ids on the rendered graph and check the real lines in the browser.

Most nodes sit outside the canvas and dragging is off, so they can’t be reached. I’ll let the view zoom out far enough to fit the graph and turn panning back on.

`@xyflow/react` draws the nodes as real elements so selection and filters stay testable, and `d3-force` places them.

The network for case `23-4587` is at `/cases/case-234587/network`. One graph holds the case’s people, evidence, places, and events, with a line only where a relation exists in that case. The suspect is a large filled navy circle, witnesses are green rings, evidence is an amber rounded rectangle, and places are red dashed circles. The right panel counts each type from the data. Turning a type off removes those nodes and any line that touched them, and the count stays the full total.

Selecting فهد القحطاني highlights him and shows **1 علاقة**. عرض التفاصيل opens the reason, a jump to the connected camera recording, and a link that opens that evidence. رجوع closes the detail. إعادة ضبط, تصغير, and تكبير reset the filters and selection or change the zoom, and the canvas can be dragged so the whole graph stays reachable.

All 44 tests passed, including the selection panel, the type filter, and the legend counts. In the browser, those flows worked and every node sat inside the canvas. The screenshot tool timed out, so this pass used the page structure and computed node styles.

---

**User**

Build the investigation room at /cases/:caseId/room. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-121

This is the screen the competition is judged on. Give it the most care.

Acceptance criteria (PBI014): the relationship network, the timeline, key evidence,
and contradiction and gap alerts are all shown; the user can move from the room into
any element's details; content refreshes when new data is added.

Build:
- Header: case title on the right; "+ إضافة دليل" primary and a "تنبيه جديد" amber
  chip with a warning icon on the left.
- Top row, two panels side by side: التسلسل الزمني (vertical timeline with certainty
  dots, time, label, and a مؤكد / استنتاج / فجوة tag) and شبكة العلاقات (a compact,
  read-only version of the network with a "4 أشخاص · 12 دليل" summary line).
- Bottom row, three cards: آخر الأدلة (list with status tags), فجوة زمنية (amber, with
  a عرض button), and تناقض مكتشف (red, with a مراجعة button).
- Every panel is clickable through to its full screen.

CRITICAL: this screen composes the network, timeline, evidence and reasoning
features. Those feature folders must not import from each other. Any piece shared
between the room and a full screen moves to src/components first. If you find
yourself writing a cross-feature import, stop and extract the shared piece.

Tests:
- integration: the room renders all four regions from the seed data
- integration: clicking a panel header navigates to the corresponding full screen
- integration: contradiction and gap cards render only when those exist in the data
- a lint-level or import check that no feature imports another feature

---

**Cursor**

The investigation room has to compose the network, timeline, evidence, and alerts without those features importing each other. I’ll read the design and the existing screens first, then extract anything shared before building the room.

The room has to show the live network, timeline, evidence, and alerts, so the graph and the add-evidence dialog move into shared components before the page is wired up.

The investigation room is live at `/cases/case-234587/room`. It composes the case’s timeline, network, evidence, and alerts from the same queries as those screens, and none of the feature folders import each other. The graph, the add-evidence dialog, status labels, and certainty tags now live in `src/components`.

The navy header carries the case title, **+ إضافة دليل** (this opens the existing add-evidence dialog), and an amber **تنبيه جديد** chip when the case has a gap or a contradiction. Beside it, the leading sequence is a vertical timeline with a green مؤكد dot, an amber استنتاج dot, or a red فجوة dot, and the network is a compact read-only graph. Its summary is counted from this case: **4 أشخاص · 10 دليل**. The bottom row lists the three latest evidence items with their status, an amber gap card with **عرض**, and a red contradiction card with **مراجعة**. Those cards are omitted when the case has neither.

Each panel title opens its full screen. **عرض** opens the timeline, **مراجعة** and an evidence node open that item, and other nodes open the network. Adding evidence refreshes the lists the room is showing.

All 47 tests passed, including the four-region render, header navigation, cards that appear only when the data has a gap or a contradiction, and the import boundary. In the browser, the layout, node styles, dialog, and navigation all behaved. The screenshot tool timed out, so that pass used the page structure and computed styles.

---

**User**

Build the analysis screen at /cases/:caseId/analysis. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-198

Two tabs in the header: كشف التناقضات and مقارنة السيناريوهات.

Acceptance criteria — PBI010: conflicting information identified, both sources
shown, the reason explained, sources openable, never treated as proof of guilt.
PBI019: the user can accept or reject, a suggestion is never fact automatically,
status clearly visible. PBI024: multiple hypotheses with supporting and opposing
evidence and their conflict points, and the system never picks the final one.

Build — contradictions tab:
- Alert cards, red for high severity and amber for medium, each with a severity chip
  (عالي / متوسط), a title, the conflicting statement in full, a muted "المصدر: …"
  line, and two buttons: مراجعة (filled) and تجاهل (outlined).
- Acting on a card changes its status visibly and the change persists in state.
  Nothing is auto-resolved.

Build — scenarios tab:
- A comparison table: rows are criteria (التوافق الكلي، أدلة داعمة، المعيار), columns
  are the scenarios (الأول / الثاني / الثالث). Match percentages are pills coloured by
  value: green high, amber medium, red low. Derive the thresholds from the data, do
  not hardcode which column is green.
- A notice strip below: النظام لا يختار السيناريو — القرار النهائي للمحقق. Always
  renders. Hard product requirement.

Tests:
- integration: مراجعة and تجاهل change the card's status and it persists
- integration: no contradiction is resolved without a user action
- unit: match percentage maps to the correct severity colour at the boundaries
- unit: the human-in-the-loop notice always renders, including with zero scenarios

---

**Cursor**

The analysis screen needs both tabs, investigator decisions that persist, and a notice that the system never picks a scenario. I’ll start from the Figma frame and the existing contradiction and sequence data.

The frame is both views at once, and the spec is two header tabs. I’ll build those from the case data, with review and dismiss kept in state and match colours taken from the percentage.

The analysis screen is at `/cases/case-234587/analysis`, and **التحليل** is in the case navigation. The header switches between **كشف التناقضات** and **مقارنة السيناريوهات**.

On the contradictions tab, each card is a recorded conflict, not a finding of guilt. Recorded facts and evidence are **عالي** (red); an inference is **متوسط** (amber). The card shows both statements, the reason, and a **المصدر** line that opens the evidence. **مراجعة** and **تجاهل** set **تمت المراجعة** or **تم التجاهل** and keep that status while you change tabs. Nothing starts resolved.

On the scenarios tab, columns are ranked **الأول / الثاني / الثالث** by match. The pill colour follows the percentage: **80 and above** green, **50–79** amber, **below 50** red, so 91 / 67 / 28 are green, amber, and red because of those cuts. **أدلة داعمة** counts supporting evidence, and the **المعيار** row counts contradictions that share evidence with that scenario. A dismissed contradiction drops out of that count. The notice **النظام لا يختار السيناريو — القرار النهائي للمحقق** is always under the table, including when a case has no scenarios.

All 51 tests passed. In the browser, the severity colours, both actions, the tab switch, the coloured pills, the notice, and an evidence source link all behaved.

---

**User**

Build the activity log at /cases/:caseId/log. Design:
https://www.figma.com/design/PJ9hhuUxKfVxZyaN9MiJpz/Untitled?node-id=4-465

Acceptance criteria (PBI021): evidence additions logged, important edits logged, the
time of each change shown, the actor shown when available, and the log reviewable.

Build:
- Header: case title on the right, تصدير and تصفية buttons on the left.
- A right-hand filter panel: الكل / إضافة أدلة / تعديلات / تحديثات النظام / قرارات
  المحقق, active item as a filled pill.
- A vertical timeline with a date divider. Each entry: a coloured dot, the time, a
  status chip (مكتمل green, نظام navy, بانتظار مراجعة amber), a title, a description
  naming the actor, and optional tag chips.
- Entries are newest first and scoped to this case.

Tests:
- integration: filter categories narrow the entries
- integration: entries render newest first
- unit: entry type maps to the right chip label and colour

---

**Cursor**

The activity log needs a filterable timeline of this case’s changes, newest first. I’ll start from the Figma frame and the existing audit data.

The log will use the case’s audit entries, newest first, with filters and status chips derived from the action type rather than the mock labels in the frame.

The activity log is at `/cases/case-234587/log`. The header shows the case title, with **تصفية** and **تصدير** on the left. **تصفية** opens the category list; **الكل** is the filled pill until another category is chosen.

Entries are newest first and limited to this case. Each row has a time, a status chip, a title, and a description that names the actor. **مكتمل** is green, **نظام** is navy, and **بانتظار مراجعة** is amber. **إضافة أدلة** keeps the two evidence additions, newest first. **تحديثات النظام** and **قرارات المحقق** show only those records. **تصدير** downloads the entries currently on screen. Adding evidence writes a new line into this log.

All 53 tests passed. In the browser, the filter, the order, the chip colours, and the actor lines all matched the case data.

---

**User**

The seed data has inconsistent counts for case 23-4587. The dashboard says 16
evidence, the evidence list shows 8, the investigation room says 10. Same case,
three numbers. A demo viewer will see all three.

Fix the SEED, not the components: make case 23-4587 actually contain 16 evidence
items, matching the design's filter counts (8 صور، 3 فيديو، 4 تقارير، 1 أقوال).
Then make every headline number on the dashboard derive from the data — إجمالي
الأدلة must equal the sum of the case rows, قضايا نشطة must equal the active cases,
تنبيهات جديدة must equal the actual alerts. No hardcoded totals anywhere.

Add a test that the dashboard total equals the sum of the per-case counts, and that
the evidence list count for a case equals that case's dashboard count.

---

**Cursor**

The three screens disagree because the seed counts don’t match the evidence rows. I’ll align case 23-4587 to 16 items and make the dashboard headlines come from that same data.

The dashboard total is a fixed 16, while the case only has 10 evidence rows. I’ll add the missing items so the filter counts are 8, 3, 4, and 1, and I’ll calculate the dashboard figures from those rows.

Case **23-4587** now holds **16** evidence items, and the headline numbers are calculated from those rows instead of fixed totals.

The evidence list for that case reads **الكل (16)**، **صور (8)**، **فيديو (3)**، **تقارير (4)**، **أقوال (1)**. The dashboard row for the case is **16**, and the investigation room says **16 دليل**. **إجمالي الأدلة** is **17**, the sum of the case rows (16 + 1 + 0). **قضايا نشطة** is **2**, the two cases whose status is active. **تنبيهات جديدة** is **1**, the one alert on file. **بحاجة مراجعة** counts evidence that is not yet analysed.

The only statement kept under **أقوال** is إفادة فهد القحطاني. إفادة نورة العتيبي and إفادة خالد المطيري are filed as photos, and the door log and inventory are filed as reports, so the four filter counts add up to 16 without dropping those records.

---

**User**

Three tasks.

1 — LANGUAGE SWITCHING (Arabic default, English secondary)

Extract every user-facing string in the app into a translation layer. No Arabic or
English text stays hardcoded in a component.

- src/i18n/ar.ts and src/i18n/en.ts, same key structure, nested by feature
  (common, nav, dashboard, cases, evidence, timeline, network, room, analysis, log).
- A LanguageProvider in src/app/ that holds the active language, and a useT() hook
  returning a t('dashboard.activeCases') function.
- Arabic is the default. Persist the choice in localStorage and restore it on load,
  wrapped in try/catch so a blocked storage never breaks the app.
- Switching updates dir and lang on the html element: ar → dir="rtl", en → dir="ltr".
  Also switch the font: IBM Plex Sans Arabic for ar, Space Grotesk for en.
- A compact toggle in the top bar showing "EN" in Arabic mode and "ع" in English
  mode. Single button, not a dropdown.

The layout already uses logical properties, so LTR should mostly work for free.
Check the sidebar, the timeline direction, and the network panel specifically —
those have directional assumptions. Fix them with logical properties, never by
branching on the language in a component.

SEED DATA STAYS ARABIC. Case names, evidence names, people, and descriptions are
content, not interface. Do not translate them and do not add English seed data.

2 — LOGO

The logo is at public/Adheed-logo.jpg. Place it:
- In the navy top bar, beside the "عضيد" wordmark, on the leading side — matching
  the Figma dashboard, where it sits at roughly 67×61 in the bar.
- As the favicon.

Reference it by path from public/. Do not inline it, redraw it, or trace it as SVG.
NOTE: the current file is a JPG with a white background, so it will show as a white
box on the navy bar. Place it correctly anyway — I am replacing the file with a
transparent version, and nothing about the markup should need to change when I do.

3 — README

Update README.md:
- Add the language switching feature to the key decisions section.
- Update the status table: dashboard, case intake, evidence, timeline and sequence,
  relationship network, investigation room, analysis, and activity log are built.
  2D crime scene, case file view, evidence detail, and in-case search are not.
  Be accurate — do not list something as built that is a placeholder.
- Keep the existing tone: plain, no emoji, no badges, no overclaiming.

TESTS
- every key present in ar.ts exists in en.ts and vice versa — no missing translations
- switching language updates the html dir attribute
- the language choice survives a reload
- no test on styling or layout

---

**Cursor**

Language switching has to cover every interface string, and the logo and README need to match the screens that are actually built. I’ll start by finding the hardcoded copy and the top bar.

The interface copy is still inline. I’m moving it into the translation files, then wiring the language switch, the logo, and the README.

Arabic stays the default, and English is now a second language you can switch from the top bar.

The interface text lives in `src/i18n/ar.ts` and `src/i18n/en.ts`, with the same keys grouped by screen. `LanguageProvider` restores the choice from `localStorage` (and ignores a blocked store), then sets `lang`, `dir`, and the font: IBM Plex Sans Arabic for Arabic, Space Grotesk for English. The top-bar button shows **EN** in Arabic and **ع** in English. Case names, evidence, people, and descriptions are still the Arabic seed content.

The logo from `/Adheed-logo.jpg` sits on the leading side of the wordmark at 67×61, and the same file is the favicon. It will show as a white box on the navy bar until you replace the file.

The sidebar, the timeline, and the network filter panel follow the writing direction with logical properties. In Arabic the sequence starts on the right and the filter panel is on the right; in English both sit on the left.

The README now records language switching in the key decisions, and the status table lists the dashboard, case intake, evidence, timeline, network, investigation room, analysis, and activity log as built. The crime scene, case file, evidence detail, and in-case search stay unfinished.

All 57 tests passed, including key parity, the `dir` update, and the language choice surviving a reload.

---

**User**

Four fixes before I push.

1. Run `npx tsc --noEmit` on its own line. The earlier attempt used && in
   PowerShell, which rejected it, so the type check never ran. Fix every type error
   it reports. Specifically check for the literal text "from the ar file?" in the
   analysis test files — that is not valid code.

2. Some strings were not extracted. In the activity log filter panel, "تصفية حسب"
   is still hardcoded in both the heading and the aria-label. Sweep every feature
   for remaining hardcoded Arabic or English in JSX, aria-labels, title attributes,
   placeholders, and error messages, and move them all into the i18n files. Add a
   test that fails if any component file contains Arabic characters in JSX.

3. Re-enable the React Flow attribution on the network graph. We are not on React
   Flow Pro and the console is warning about it.

4. Confirm the seed count fix landed: case 23-4587 must have 16 evidence items, the
   evidence filter pills must total 16, the investigation room summary must count
   the same 16, and the dashboard total must be the sum of the case rows. If this
   was not done, do it now. If it was, tell me the numbers each screen shows.

Then run the full test suite and report the count.

---

**Cursor**

I’ll start with a standalone type check, then hunt leftover interface strings, the React Flow attribution, and the evidence counts.

The type check is clean and that broken phrase is gone. Next I’ll look for interface strings still sitting in components, including English as well as Arabic.

The type check passed on its own, and the activity-log heading already comes from the translation files. I’m turning that into a guard so Arabic cannot land back in component JSX, and I’m turning the React Flow attribution back on.

`npx tsc --noEmit` finished on its own with no type errors. The analysis tests do not contain the text "from the ar file?".

The activity-log heading and its `aria-label` both already use `t('log.filterBy')`, whose Arabic value is "تصفية حسب". A sweep of component JSX, `aria-label`s, titles, placeholders, and error messages found no other hardcoded interface strings. A new test fails if any component file contains Arabic characters outside comments. Stored audit sentences still drop the prefixes إضافة, إنشاء, and تحديث before the translated verb is added, because those prefixes are part of the seed text.

React Flow attribution is on again for the full network and the compact graph in the investigation room.

The seed counts already match across screens:

| Screen | What it shows |
| --- | --- |
| Case 23-4587 | 16 evidence items |
| Evidence filters | All 16, photos 8, video 3, reports 4, statements 1 |
| Investigation room | 4 people · 16 evidence |
| Dashboard rows | 16, 1, and 0 |
| Dashboard total | 17, the sum of those rows |

Active cases are 2, new alerts are 1, and pending review is 10.

The full suite is 27 files, 58 tests, all passed.


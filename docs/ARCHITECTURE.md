# Adheed frontend architecture

Day-1 skeleton. Feature screens are placeholders. This document is also the contract draft to share with Ali.

## Folder structure

```
src/
  app/           shell, router, layouts, providers
  features/      one folder per domain; never import across features
  components/    ui primitives + layout chrome
  api/           fetch client, endpoint paths, mock/real switch
  mocks/         seed data + handlers (one handler file per resource)
  schemas/       Zod schemas and inferred types
  lib/           cn(), datetime, RTL helpers
  config/        typed env + flags
  styles/        tokens.css (palette + semantic) and index.css
```

Every feature folder: `api/`, `components/`, `hooks/`, `pages/`, `types.ts`, `__tests__/`.

## Data flow

```
page → hook → src/api → mock handlers | real fetch
```

Components do not fetch. `src/api/index.ts` picks the implementation from `env.USE_MOCKS`.

Pages today are placeholders and do not call hooks yet. When a PBI is built, add the hook in that feature and keep the fetch behind `src/api`.

## Mock-to-real switch

1. Keep `VITE_USE_MOCKS=true` (default) while the backend is unavailable.
2. Agree payload shapes in `src/schemas` with Ali. Endpoint paths live in `src/api/endpoints.ts`.
3. When the API is reachable, set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL` to the real origin (see `.env.example`).
4. No page or hook changes if the contract matches the schemas. A schema parse failure is a contract break — fix the schema or the API, do not silently coerce.

## Provisional API contract

All case-scoped lists are filtered to one case. Paths:

| Method | Path | Body |
| --- | --- | --- |
| GET | `/cases` | `Case[]` |
| GET | `/cases/:caseId` | `Case` |
| GET | `/cases/:caseId/evidence` | `Evidence[]` |
| POST | `/cases/:caseId/evidence` | `Evidence` |
| GET | `/cases/:caseId/evidence/:evidenceId` | `Evidence` |
| GET | `/cases/:caseId/people` | `Person[]` |
| GET | `/cases/:caseId/places` | `Place[]` |
| GET | `/cases/:caseId/events` | `TimeEvent[]` |
| GET | `/cases/:caseId/sequences` | `Sequence[]` |
| GET | `/cases/:caseId/relations` | `Relation[]` |
| GET | `/cases/:caseId/suggestions` | `Suggestion[]` |
| GET | `/cases/:caseId/contradictions` | `Contradiction[]` |
| GET | `/cases/:caseId/gaps` | `Gap[]` |
| GET | `/cases/:caseId/audit` | `AuditEntry[]` |
| GET | `/cases/:caseId/search` | reserved |

`Suggestion`, `Contradiction`, and `Gap` always include `reason`, `evidenceIds`, and `certainty: 'fact' | 'evidence' | 'inference' | 'uncertain'`. No endpoint returns a verdict, guilt score, or accusation.

Seed case: jewellery-store theft, number `23-4587`, id `case-234587`. Fictional names only.

## Token system

Two layers in `src/styles/tokens.css`:

1. **Raw palette** (`--brand-*`, `--brand-font-*`). Sumaya's delivered light identity. The only place a hex, `rgb()`, or raw font name may appear.
2. **Semantic tokens** in `@theme` (`--color-surface`, `--color-text`, `--color-accent`, certainty colours including `--color-fact`, alerts, spacing, radius, type). Components use these names as Tailwind utilities. The light page/panel mapping lives here — components were not rewritten to swap the theme.

Components never reference `--brand-*`.

## Applying the final design

When Sumaya hands over Figma (palette, type, component states):

1. Replace the Layer 1 `--brand-*` values (and font families if they change) in `src/styles/tokens.css`.
2. Remap Layer 2 only if a semantic role changes (for example if Bronze is no longer the accent).
3. Do not edit components, pages, or layouts to change colour or type.

Verify the swap:

- Search the repo for `#`, `rgb(`, `hsl(`, `--brand-`, `IBM Plex`, and `Space Grotesk`. Hits should be `src/styles/tokens.css` and the Google Fonts link in `index.html` only.
- Spot-check `Button`, `CertaintyBadge`, `StatusChip`, and both layouts: they still compile and still use `bg-surface` / `text-accent` / `border-evidence` utilities.
- If a new role appears (for example a success colour), add a semantic token in `tokens.css` first, then wire the component to that token — never to a raw value.

## Open contract — needs backend confirmation

These enums are **frontend assumptions**. They are not specified in the backlog CSV (or were slugified from prose). Confirm them with the backend and product lead before integration.

Changing any of them later means changing **the Zod schemas, the seed data, and the tests together**. Do not change one without the others.

Copy from here:

```
certainty
  values: fact | evidence | inference | uncertain
  used on: Suggestion, Contradiction, Gap (required on every AI output)
  note: NFR-04 / PBI031. Four levels, not three. Never a verdict.

person.role
  values: victim | witness | person_of_interest | suspect | officer
  used on: Person
  note: suspect is an investigator-assigned role (مشتبه به), not an AI conclusion.

case.status
  values: active | suspended | closed
  labels: نشطة | معلقة | مغلقة
  used on: Case, the create-case segmented control, and the dashboard status pill
  note: the create screen uses these three. Confirm with the backend. active was previously split into open and under_investigation.

evidence.status
  values: logged | under_review | analysed
  labels: معلق | بانتظار المراجعة | مؤكد
  used on: Evidence and the evidence status pill
  note: invented. CSV only says "the status of each evidence item is clearly shown". logged and under_review render with a dashed row border.

evidence.type
  values: photo | video | cctv | forensic_report | medical_report | witness_statement | suspect_statement | digital | other
  used on: Evidence
  note: slugified from the PBI004 type list. Confirm the codes.

sequence
  values: ordered steps with certainty, reason, and evidenceIds; matchPercent 0–100
  used on: the timeline screen
  note: a suggested ordering, not a finding. The investigator notice always renders. fact and evidence share the confirmed green treatment; inference is amber; uncertain is the red dashed gap.

timeEvent.timePrecision
  values: exact | approximate | unknown
  used on: TimeEvent
  note: invented to mark events without an exact time (PBI012).

suggestion.status
  values: pending | accepted | rejected
  used on: Suggestion
  note: invented. CSV uses suggested / accepted / rejected. pending = not yet reviewed.

entityType (relation endpoints)
  values: case | evidence | person | place | event
  used on: Relation.fromType, Relation.toType
  note: invented node types for the case network.
```

No endpoint returns a verdict, guilt score, or accusation. AI output must not assign or imply guilt. `suspect` on a Person is investigator-recorded, not system-assigned.


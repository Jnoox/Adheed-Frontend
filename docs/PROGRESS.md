# Adheed Frontend — Progress Log

## Status
| PBI | Title | State |
|-----|-------|-------|
| PBI033 | Repository, environments and project structure | In Progress |
| PBI034 | Design system, tokens and RTL foundation | In Progress |
| PBI035 | API contract and mock data layer | In Progress |

## Daily log

### Day 1 — 14 Sep 2026
**PBIs touched:** PBI033, PBI034, PBI035
**Done:**
- Frontend skeleton: Vite + React 19 + TypeScript, RTL shell, UI primitives, Zod schemas, mock layer behind `VITE_USE_MOCKS`, Vitest.
- Routing: `/` is DashboardPage (PBI026), `/cases` is CasesListPage (PBI001). Sidebar matches. Reasoning and search have no routes (surfaces / topbar later).
- Certainty union is four levels: `fact | evidence | inference | uncertain`, with `--color-fact` and CertaintyBadge labels حقيقة / دليل / استدلال / غير مؤكد.
- `suspect` restored as a person role. Seed certainty assigned by meaning, not to fill the enum.
- Docs: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/adheed.mdc`, `docs/ARCHITECTURE.md` (open contract section for Ali), `docs/BACKLOG.md`, bilingual `README.md`.
**Decisions:**
- Dashboard and cases list are separate screens. Features never cross-import.
- Certainty is NFR-04’s four levels. Suggestions are inference (or uncertain for a weak link), never fact. A contradiction is not raised as uncertain.
- `suspect` is an investigator-recorded role, not an AI verdict. The no-verdict rule stays on AI output only.
- Case status, evidence status, person roles, and certainty are frontend assumptions until Ali confirms them. Changing them later means schemas, seed, and tests together.
**Blocked / waiting on:**
- Sumaya: Figma tokens and component states (D034).
- Ali: confirm the open-contract enums and endpoint payloads (PBI035).
**Next session:**
- First product PBI after review: PBI026 (dashboard) or PBI001 (create case). Do not implement feature logic until one is named.
**Tests:** `npm run test:run` — 4 files, 26 passed.

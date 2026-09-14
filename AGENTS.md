# Adheed frontend

AI-assisted criminal investigation platform (عضيد). Arabic-first, RTL-default, 16-day competition MVP.

This file is the source of truth for agent sessions. Do not implement feature logic unless the current session names a PBI.

## Stack

Vite, React 19, TypeScript, React Router, TanStack Query, Zod, Tailwind CSS v4, Vitest.

No backend yet. All data comes from `src/api`, which switches mock vs real via `VITE_USE_MOCKS` (default `true`).

## Folder rules

- Features live under `src/features/<name>/` with `api/`, `components/`, `hooks/`, `pages/`, `types.ts`, `__tests__/`.
- A feature never imports from another feature. Shared code goes to `src/components`, `src/lib`, or `src/schemas`.
- Pages call hooks, hooks call `src/api`, `src/api` chooses mock or real. Components never fetch.
- Named exports only. Default exports are allowed only for route-level pages.
- Path alias `@/` → `src/`.

## RTL

`dir="rtl"` and `lang="ar"` on `<html>`. Use CSS logical properties and Tailwind logical utilities (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`). Never `pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`.

## Tokens

Two layers in `src/styles/tokens.css` only:

1. Raw `--brand-*` palette and font families. Provisional. The only place a hex, `rgb()`, or raw font name may appear.
2. Semantic tokens in `@theme`: surfaces, text, borders, accent, certainty (`fact` / `evidence` / `inference` / `uncertain`), alerts (`contradiction` / `gap`), spacing, radius, type scale.

Components, pages, and layouts use semantic tokens only (`bg-surface`, `text-accent`, `border-evidence`). Never a hex, never `--brand-*`. If a value is missing, add a semantic token — do not inline it. Styling today is plain: structure, spacing, states. No decoration.

## Domain rules

- Fictional seed data only. No real or sensitive personal data.
- AI output is never a verdict. `Suggestion`, `Contradiction`, and `Gap` always include `reason`, `evidenceIds`, and `certainty: 'fact' | 'evidence' | 'inference' | 'uncertain'`.
- Copy must not imply the system decides, accuses, or convicts.

## Naming

Routes and PBI ids stay in `src/app/router.tsx`. Arabic UI copy. Latin case numbers and ids use `font-latin`.

## Testing

Vitest + Testing Library. Test schemas, the mock switch, route placeholders, and `CertaintyBadge`. Do not test provisional styling or trivial layout.

```
npm run test        # watch
npm run test:ui     # UI
npm run test:run    # CI / end of session
```

## End of session (only when the user says the session is done)

1. Append a dated entry to `docs/PROGRESS.md`.
2. Update the status table at the top.
3. Run `npm run test:run` and record the result in the entry.
4. Suggest a conventional-commit message. Do not commit unless asked.

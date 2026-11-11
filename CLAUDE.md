# RL Spencer Roofing CRM

Small roofing-company CRM. Next.js 15 App Router, React 19, TypeScript, MUI 6,
Drizzle ORM over MySQL (Cloud SQL), NextAuth credentials login, deployed to
Google Cloud Run from a multi-stage Docker image.

Read `ARCHITECTURE.md` before touching data flow. The one rule: Server
Components fetch, Server Actions mutate, Client Components only where the
browser needs to do something.

## Commands

```bash
npm run dev          # local dev server on :3000 (needs .env.local)
npm run build        # production build; must pass before any PR
npm run lint         # next lint
npx tsc --noEmit     # type check
npm run db:generate  # emit a SQL migration from app/db/schema.ts into drizzle/
npm run db:studio    # browse the DB
```

There is no test runner yet. When one is added it will be Vitest and the
command will be `npm test`. Do not claim tests pass until that exists.

Never run `npm run db:push`, `./deploy.sh`, `gcloud run deploy`, or
`gcloud builds submit`. Those touch the live database or the live service and
are reserved for a human with a terminal. A hook blocks them anyway.

## Layout

- `app/(dashboard)/*/page.tsx` — one thin page per pipeline, renders `PipelineBoard`
- `app/components/PipelineBoard.tsx` — Server Component; fetches, filters, groups
- `app/components/CustomerCard.tsx` — Client Component; presentational plus dialogs
- `app/components/CustomerFormDialog.tsx` — the add/edit customer form
- `app/actions/*.ts` — `"use server"` mutations, each re-checks the session
- `app/db/schema.ts` — Drizzle tables `customer` and `notes`; the source of truth
- `app/db/queries/*.ts` — read-only queries, used only from Server Components
- `app/lib/validation.ts` — Zod schemas that every action parses `FormData` through
- `app/lib/constants.ts` — `jobStages`, `jobTypes`, `salesReps` enums
- `middleware.ts` — NextAuth gate for everything except `/login`, `/api/*`, static
- `openspec/` — specs that agents implement against; read the relevant one first

## Conventions

- Mutations go through a Server Action that calls `requireSession()`, parses
  with Zod, writes with Drizzle, then `revalidatePath("/", "layout")`.
  No hand-written API routes for app data.
- Nothing outside `app/db` and `app/actions` imports the `db` client.
- Props crossing the server/client boundary must be plain serializable data.
- Adding a customer field touches, in order: `schema.ts`, a generated migration,
  `validation.ts`, `CustomerFormDialog.tsx`, `CustomerCard.tsx`, the README table.
  Use the `add-crm-field` skill for this.
- Enum-like columns (`stage`, `jobType`, `salesperson`) are validated against the
  arrays in `constants.ts`. Do not add a new enum value without checking what is
  already stored in the table; some existing values are intentionally misspelled.
- `price` is a MySQL `decimal`; Drizzle returns it as a string. Convert at the edge.

## Data and secrets

This is a CRM. The `customer` table holds real names, phones, emails and
addresses. Rules:

- Never read `.env`, `.env.local`, or `.env.deploy.yaml`. Use `.env.local.example`
  and `.env.deploy.yaml.example` to learn variable names.
- Never query the production database or paste customer rows into context.
  When sample data is needed, invent it or use the fixtures under `evals/`.
- Never log or echo a `DB_*`, `NEXTAUTH_*`, or `APP_PASSWORD` value.
- Server-only env vars have no `NEXT_PUBLIC_` prefix. Keep it that way.

## Working style

- Small diffs. One concern per PR.
- Run `npm run build` and `npx tsc --noEmit` before saying work is done, and
  report the actual output if either fails.
- When a change contradicts a spec in `openspec/`, update the spec in the same
  PR and say so.

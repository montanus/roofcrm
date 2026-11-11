# Architecture

## High-level model

The app follows one rule: push data-fetching to the server, push interactivity to
the client, and keep the boundary between them as small as possible. Concretely:

- **Server Components** (no `"use client"`) do the data fetching. They render on
  the server, query MySQL directly, and ship only HTML + a serialized data
  payload to the browser — no client-side `fetch`, no loading spinners for
  initial data.
- **Server Actions** (`"use server"`) handle every mutation (create/edit/delete).
  A `<form action={someServerAction}>` posts directly to a server function — no
  hand-written API routes, no manual `fetch` + refetch dance.
- **Client Components** (`"use client"`) exist only where something needs to run
  in the browser: dialogs that open/close, a search box that types, a form that
  shows pending/error state.

## Request lifecycle: loading a page

1. `middleware.ts` runs first, on the edge, for every route except `/login`,
   `/api/*`, and static assets. It checks the NextAuth session cookie
   (`withAuth`) and redirects to `/login` if there's none.
2. The route resolves to a page like `app/(dashboard)/repairs/page.tsx` — an
   `async` Server Component. It awaits `searchParams` (a promise since Next 15)
   and hands off to `PipelineBoard`.
3. `app/components/PipelineBoard.tsx` — also a Server Component — calls
   `getCustomers()` and `getNotesByCustomerIds()` directly (real
   `await db.select()...` calls, no HTTP round-trip), filters/groups the results
   in plain JS, and renders one `CustomerCard` per customer.
4. The whole tree renders to HTML on the server. The client receives finished
   markup, not a skeleton.

The `(dashboard)` route group (`app/(dashboard)/layout.tsx`) wraps all four
pipeline pages with `Header`/`Footer`; `/login` sits outside that group so it
renders without them and without needing a session.

## Request lifecycle: a mutation

Take editing a customer:

1. `CustomerFormDialog` (client) renders a plain `<form action={formAction}>`,
   where `formAction` comes from `useFormState(saveCustomer, ...)`.
2. Submitting posts the form directly to `app/actions/customers.ts`'s
   `saveCustomer` — a real server function, not a route handler.
3. `saveCustomer` re-checks the session (`getServerSession`), validates the raw
   `FormData` with a Zod schema, runs the Drizzle `update`/`insert`, then calls
   `revalidatePath("/", "layout")`.
4. `revalidatePath` invalidates the Next.js cache for every page under that
   layout, so the next render (including the one that happens right after the
   action returns) re-fetches fresh data from MySQL. No manual "refetch and
   setState" — the framework handles it.

This is also why deleting a note (`DeleteNoteButton` in `CustomerNotesDialog`)
doesn't use a form at all — it just calls the exported `deleteNote(noteId)`
server action directly from an `onClick`, wrapped in `useTransition` for the
pending state. Server Actions are plain async functions; you can call them
either way.

## The server/client boundary

The rule: a Server Component can render a Client Component, but any props it
passes across that boundary must be serializable (plain objects, strings,
numbers — not functions, not class instances).

`CustomerCard.tsx` renders MUI's `Avatar`/`Card`/`Typography` — all of which are
Client Components internally (MUI ships `"use client"` on them). The component
uses the MUI idiom `sx={{ bgcolor: (theme) => theme.palette.secondary.main }}` —
a *function* value. As long as `CustomerCard` itself is a Client Component,
that's fine (function props between two client-side components in the same tree
never get serialized). If it were a Server Component instead, handing a function
to a Client Component would throw at render time — which is exactly why
`CustomerCard.tsx` is marked `"use client"` at the top.

The pattern this leaves:

- `PipelineBoard` (server): fetches, filters, composes — passes only plain data
  (`customer`, `notes` objects) to `CustomerCard`.
- `CustomerCard` (client): presentational, but "client" because it needs MUI's
  function-valued `sx` callbacks and hosts two dialogs.
- `CustomerFormDialog` / `CustomerNotesDialog` / `PipelineFilters` (client): own
  state (`open`, form pending/error) and browser APIs (`useRouter`,
  `useSearchParams`).

## Data layer

- `app/db/schema.ts` — Drizzle table definitions (`customer`, `note`), verified
  against the live Cloud SQL schema.
- `app/db/client.ts` — one `mysql2` pool, cached on `globalThis` so dev-mode hot
  reloads don't leak connections; wrapped in `drizzle()`.
- `app/db/queries/` — read-only query functions (`getCustomers`,
  `getNotesByCustomerIds`) used only by Server Components.
- `app/actions/` — `"use server"` mutation functions used only by Client
  Components' forms/handlers.

Nothing outside `app/db` and `app/actions` talks to MySQL directly — that seam
is what makes it possible to fix or evolve the schema without touching any page
or component code.

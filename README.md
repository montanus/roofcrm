# RL Spencer CRM

A small roofing-company CRM built on Next.js App Router as a reference example:
Server Components fetch data directly, mutations go through Server Actions, and
Drizzle ORM is the typed data layer over MySQL.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # if you don't already have one — fill in DB + auth values
npm run dev
```

Required environment variables (see `.env.local`):

| Variable | Purpose |
| --- | --- |
| `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_SCHEMA` | MySQL connection (server-only, no `NEXT_PUBLIC_` prefix) |
| `APP_PASSWORD` | Shared passcode checked by the credentials login |
| `NEXTAUTH_SECRET` | Session/JWT signing secret for NextAuth |
| `NEXTAUTH_URL` | Base URL NextAuth uses for callbacks |
| `NEXT_PUBLIC_SITE_TITLE` | Browser tab title (safe to expose to the client) |

## Data layer

`app/db/schema.ts` defines the `customer` and `notes` tables with Drizzle,
verified directly against the live `reservation-sample` Cloud SQL database
(`olgadance-218922:us-east1:reservation`) — there's no `job`/`costs` table in
production, so this app doesn't model them. If the schema ever needs
re-checking:

```bash
npm run db:pull      # introspect the live DB into drizzle/ for comparison
npm run db:studio    # browse the DB through Drizzle Studio
```

`app/db/client.ts` reads the connection from env vars and exposes a shared
`db` instance; `app/db/queries/*` holds read queries, `app/actions/*` holds the
`"use server"` mutations (create/update/delete), each validated with the zod
schemas in `app/lib/validation.ts`.

## Routes

Four pipelines, each a thin page rendering `<PipelineBoard stages={...} />`
(`app/components/PipelineBoard.tsx`), which fetches and filters customers on the
server based on the `?stage=&rep=&q=` URL search params set by
`PipelineFilters`:

- `/` — Sales (Calls → Signed)
- `/production` — Signed → Balance Due
- `/repairs` — Repairs / Punch List
- `/b2b` — B2B

`/login` is the only public route; `middleware.ts` gates everything else behind
the NextAuth credentials session.

## Deploying

```bash
cp .env.deploy.yaml.example .env.deploy.yaml   # first time only — fill in real values
./deploy.sh
```

`deploy.sh` builds the image with Cloud Build, pushes it to Artifact Registry
(`us-east1-docker.pkg.dev/olgadance-218922/roofcrm/roofcrm`, tagged by git
commit), and deploys it to the `monty-reservations-frontend` Cloud Run service
in `us-east1`, wired to the `reservation` Cloud SQL instance over its Unix
socket (`--add-cloudsql-instances`, matching `DB_SOCKET_PATH` in
`app/db/client.ts`). Environment variables for the deployed service come
entirely from `.env.deploy.yaml` (gitignored — never commit it), which
**replaces** the service's env vars on every deploy, not merges with them.

To build locally instead of via Cloud Build: `docker build -t roofcrm .` — the
image doesn't need `.env.deploy.yaml` (it's excluded via `.dockerignore`); only
`.env`'s `NEXT_PUBLIC_SITE_TITLE` gets baked in at build time, everything else
comes from the real Cloud Run environment at runtime.

## Reference schema dump

```sql
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first` varchar(100) NOT NULL,
  `last` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jobType` varchar(50) NOT NULL,
  `stage` varchar(50) NOT NULL,
  `notes` text,
  `price` decimal(13,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `gdrive` text,
  `salesperson` varchar(255) DEFAULT NULL,
  `sortorder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `costs` (
    `id` int NOT NULL,
    `job_id` int NOT NULL,
    `cost_type` varchar(50) NOT NULL,
    `cost_desc` text,
    `cost_cost`  DECIMAL(13, 2),
    `cost_percent`  DECIMAL(13, 2),
    PRIMARY KEY (id),
    FOREIGN KEY (job_id) REFERENCES job(id)
);

CREATE TABLE `job` (
    `id` int NOT NULL,
    `customer_id` int NOT NULL,
    `job_type` varchar(50) NOT NULL,
    `stage` varchar(50) NOT NULL,
    `contract_price`  DECIMAL(13, 2),
    `gdrive` text,
    `job_desc` text,
    `sort_order` int,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);
```

Note: the app doesn't currently expose any UI for the `job`/`costs` tables — see
the "Jobs feature dropped" note in project history for why.

---
name: add-crm-field
description: Add a new column to the customer table end to end — Drizzle schema, SQL migration, Zod validation, the add/edit form dialog, the customer card, and the README. Use whenever asked to add, track, or store a new piece of customer information (a field, column, attribute, or property on customers).
---

# Add a customer field

Adding one field touches six places. Do them in this order so each step's
types drive the next. Ask for the field's name, type, and whether it is
required only if the request did not say; otherwise pick sensible defaults and
state them.

## 1. Schema: `app/db/schema.ts`

Add the column to the `customer` table. Match the existing style:

```ts
roofColor: varchar("roofColor", { length: 50 }),
```

Column name in the DB uses the same camelCase as the existing `jobType`
column unless the request says otherwise. Free text is `text()`, short strings
`varchar` with an explicit length, money `decimal` with precision 13 scale 2,
flags `tinyint` or `boolean`, dates `timestamp`. Nullable by default; add
`.notNull()` only when the request says required, because existing rows have
no value for it.

## 2. Migration

Run `npm run db:generate`. It writes a SQL file into `drizzle/`. Open it and
confirm it is a single `ALTER TABLE customer ADD ...`. Never run `db:push`.
The migration is applied to Cloud SQL by a human; say so in the PR description.

## 3. Validation: `app/lib/validation.ts`

Add the field to `customerFormSchema`. Optional strings follow the pattern
`z.string().trim().optional().default("")`. Enums reference an array in
`app/lib/constants.ts`; add the array there first. Numbers use `z.coerce`.

Because `saveCustomer` spreads `parsed.data` into the insert and update, no
change is needed in `app/actions/customers.ts` unless the field needs a type
conversion like `price` does.

## 4. Form: `app/components/CustomerFormDialog.tsx`

Add a `TextField` in the grid, with `name` equal to the schema key and
`defaultValue={customer?.<field> ?? ""}`. For enums copy the `select` pattern
used by the `stage` field. Keep the field order the same as the schema.

## 5. Display: `app/components/CustomerCard.tsx`

Show the value where it belongs on the card. Guard nullable values with a
conditional like the existing `customer.email` block. Format money and dates
with the helpers already in the file.

## 6. Docs: `README.md`

Add the column to the `CREATE TABLE customer` block near the bottom.

## Verify

Run `npx tsc --noEmit` and `npm run build`. Paste the real output. Then
report: the six files changed, the migration filename, and whether the
column is nullable.

## Do not

- Do not change `app/db/client.ts`, `middleware.ts`, or auth.
- Do not touch the `notes` table.
- Do not query the live database to look at existing values.

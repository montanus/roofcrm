# Customers

## Purpose

A customer is one roofing lead or job. It moves through the stages in
`jobStages` on one of four pipeline boards.

## Requirements

1. A customer has first and last name (required), address, phone, email,
   jobType, stage, salesperson, price, sortorder (priority 1 to 9), notes
   (short comment), and gdrive (link to the job folder).
2. Create and edit use the same form and the same Server Action,
   `saveCustomer`. A missing `id` means create.
3. Every mutation requires a NextAuth session and is validated with
   `customerFormSchema` before any database write.
4. After any mutation the whole dashboard layout is revalidated so every board
   shows fresh data on the next render.
5. `stage`, `jobType`, and `salesperson` only accept values from
   `app/lib/constants.ts`.
6. A customer in the `Internet` stage can be moved to `No Sale` with one
   click; the action re-checks the current stage server-side.
7. Deleting a customer is a hard delete. Notes for that customer are not
   cascaded by the app; the DB owns that.
8. Boards are filtered by `?stage=&rep=&q=` search params on the server.
9. A customer created from the add-customer form starts in the `Needs Quote`
   stage (`defaultJobStage` in `app/lib/constants.ts`) unless the user picks
   another stage. Editing keeps the customer's stored stage. Customers created
   by the `/api/contactform` route still start in `Internet`.

## Out of scope

Jobs and costs tables (dropped; not in production). Multi-user accounts; the
app has one shared passcode.

## Open questions

- Should `No Sale` be reachable from stages other than `Internet`?

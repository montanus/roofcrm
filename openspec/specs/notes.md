# Notes

## Purpose

Timestamped free-text notes attached to a customer, shown newest first in a
dialog on the customer card.

## Requirements

1. A note has a customerId, optional title, required content, createdAt, updatedAt.
2. Notes for a whole board load in one query keyed by customer id; no per-card fetch.
3. Create and delete go through Server Actions in `app/actions/notes.ts`,
   each requiring a session and revalidating the layout.
4. The card shows the latest note inline and the full list in the dialog.

## Out of scope

Editing an existing note. Attachments.

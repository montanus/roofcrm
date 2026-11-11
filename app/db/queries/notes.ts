import { desc, inArray } from "drizzle-orm";
import { db } from "../client";
import { note, type Note } from "../schema";

/**
 * All notes for the given customers, grouped by customer id and sorted
 * newest-first — one query for the whole board instead of an N+1 fetch per
 * card. Callers that only need the latest note can read entry[0].
 */
export async function getNotesByCustomerIds(
  customerIds: number[]
): Promise<Map<number, Note[]>> {
  const notesByCustomer = new Map<number, Note[]>();
  if (customerIds.length === 0) return notesByCustomer;

  const rows = await db
    .select()
    .from(note)
    .where(inArray(note.customerId, customerIds))
    .orderBy(desc(note.createdAt));

  for (const row of rows) {
    const existing = notesByCustomer.get(row.customerId);
    if (existing) {
      existing.push(row);
    } else {
      notesByCustomer.set(row.customerId, [row]);
    }
  }
  return notesByCustomer;
}

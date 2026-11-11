import { asc, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { customer, type Customer } from "../schema";

export async function getCustomers(): Promise<Customer[]> {
  const rows = await db
    .select()
    .from(customer)
    .orderBy(asc(customer.sortorder), asc(customer.last));
  return rows;
}

export async function getCustomerById(id: number): Promise<Customer | undefined> {
  const rows = await db.select().from(customer).where(eq(customer.id, id));
  return rows[0];
}

export async function getRecentCustomers(limit = 25): Promise<Customer[]> {
  return db
    .select()
    .from(customer)
    .orderBy(desc(customer.createdAt))
    .limit(limit);
}

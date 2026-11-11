import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  timestamp,
} from "drizzle-orm/mysql-core";

// Verified against the live `reservation-sample` Cloud SQL database
// (olgadance-218922:us-east1:reservation) on 2026-08-29. There's no `job` or
// `costs` table in production — see the "Jobs feature dropped" note in the
// project history for why this app doesn't model them.

export const customer = mysqlTable("customer", {
  id: int("id").autoincrement().primaryKey(),
  first: varchar("first", { length: 100 }).notNull(),
  last: varchar("last", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  jobType: varchar("jobType", { length: 50 }).notNull(),
  stage: varchar("stage", { length: 50 }).notNull(),
  notes: text("notes"),
  price: decimal("price", { precision: 13, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  gdrive: text("gdrive"),
  salesperson: varchar("salesperson", { length: 255 }),
  sortorder: varchar("sortorder", { length: 255 }),
});

export const note = mysqlTable("notes", {
  noteId: int("note_id").autoincrement().primaryKey(),
  customerId: int("customer_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type Customer = typeof customer.$inferSelect;
export type NewCustomer = typeof customer.$inferInsert;
export type Note = typeof note.$inferSelect;
export type NewNote = typeof note.$inferInsert;

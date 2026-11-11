"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/db/client";
import { customer } from "@/app/db/schema";
import { customerFormSchema } from "@/app/lib/validation";

export type CustomerActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be signed in.");
}

export async function saveCustomer(
  _prevState: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  await requireSession();

  // The hidden "id" input submits as "" when adding a new customer — treat
  // that as absent rather than letting z.coerce.number() turn it into 0.
  const raw = Object.fromEntries(formData);
  if (!raw.id) delete raw.id;

  const parsed = customerFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { id, price, ...values } = parsed.data;

  if (id) {
    await db
      .update(customer)
      .set({ ...values, price: price.toString() })
      .where(eq(customer.id, id));
  } else {
    await db.insert(customer).values({ ...values, price: price.toString() });
  }

  revalidatePath("/", "layout");
  return { status: "success" };
}

export async function deleteCustomer(id: number): Promise<void> {
  await requireSession();
  await db.delete(customer).where(eq(customer.id, id));
  revalidatePath("/", "layout");
}

/**
 * Only valid from the "Internet" stage — mirrors the client-side gating in
 * CustomerCard, but re-checked here since the action can be called directly.
 */
export async function markCustomerNoSale(id: number): Promise<void> {
  await requireSession();
  await db
    .update(customer)
    .set({ stage: "No Sale" })
    .where(and(eq(customer.id, id), eq(customer.stage, "Internet")));
  revalidatePath("/", "layout");
}

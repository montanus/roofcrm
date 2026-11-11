"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/db/client";
import { note } from "@/app/db/schema";
import { noteFormSchema } from "@/app/lib/validation";

export type NoteActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be signed in.");
}

export async function saveNote(
  _prevState: NoteActionState,
  formData: FormData
): Promise<NoteActionState> {
  await requireSession();

  const parsed = noteFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { noteId, customerId, title, content } = parsed.data;

  if (noteId) {
    await db.update(note).set({ title, content }).where(eq(note.noteId, noteId));
  } else {
    await db.insert(note).values({ customerId, title, content });
  }

  revalidatePath("/", "layout");
  return { status: "success" };
}

export async function deleteNote(noteId: number): Promise<void> {
  await requireSession();
  await db.delete(note).where(eq(note.noteId, noteId));
  revalidatePath("/", "layout");
}

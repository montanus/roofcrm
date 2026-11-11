import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { customer } from "@/app/db/schema";
import { contactFormSchema } from "@/app/lib/validation";

// Public, unauthenticated endpoint — CORS-open for POST in next.config.js so an
// external marketing/contact page can submit leads directly into the pipeline.
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    );
  }

  try {
    const [result] = await db.insert(customer).values({
      ...parsed.data,
      stage: "Internet",
      jobType: "Shingle",
      salesperson: "Conley",
      sortorder: "1",
      price: "0",
    });

    return NextResponse.json({ message: "Data inserted successfully", id: result.insertId });
  } catch (error) {
    console.error("Error inserting contact form lead:", error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}

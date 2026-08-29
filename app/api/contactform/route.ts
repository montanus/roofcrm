import { NextResponse } from "next/server";
import { getPool } from "@/app/libs/mysql";

export async function POST(request) {
  const body = await request.json();

  try {
    const db = getPool();

    const [result] = await db.execute(
      "INSERT INTO customer (first, last, address, phone, email, price, stage, jobType, salesperson, sortorder, notes, gdrive) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        body?.first,
        body?.last,
        body.address ? body.address : "",
        body.phone ? body.phone : "",
        body.email? body.email : "",
        body.price ? body.price : 0,
        body.stage = "Internet",
        body.jobType ? body.jobType : "Shingle",
        body.salesperson ? body.salesperson : "Conley",
        body.sortorder ? body.sortorder : "1",
        body.notes ? body.notes : "",
        body.gdrive ? body.gdrive : "",
      ]
    );


    return NextResponse.json({
      message: "Data inserted successfully",
      id: result,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getPool } from "@/app/libs/mysql";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "You must be signed in to view the protected content on this page.", 
      },);
    }
  try {
    const db = getPool();
    const query = "select * from customer";
    const [rows] = await db.execute(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("DB error:", error);

    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "You must be signed in to view the protected content on this page.", 
      },);
    }

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
        body.stage ? body.stage : "Calls",
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
export async function PUT(request) {
  const body = await request.json();
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "You must be signed in to view the protected content on this page.", 
      },);
    }
  try {
    const db = getPool();

    const [result] = await db.execute(
      "UPDATE customer SET first = ?, last = ?, address = ?, phone = ?, email = ?, price = ?, stage = ?, jobType = ?, salesperson = ?, sortorder = ?, notes = ?, gdrive = ? WHERE id = ?",
      [
        body.first,
        body.last,
        body.address ? body.address : "",
        body.phone ? body.phone : "",
        body.email? body.email : "",
        body.price ? body.price : 0,
        body?.stage,
        body.jobType,
        body.salesperson,
        body.sortorder ? body.sortorder : "9",
        body.notes ? body.notes : "",
        body.gdrive ? body.gdrive : "",
        body.id,
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

export async function DELETE(request) {
  const body = await request.json();
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      {
        error: "You must be signed in to view the protected content on this page.", 
      },);
    }

    const db = getPool();
    const [result] = await db.execute("DELETE FROM customer WHERE id = ?", [
    body.id,
  ]);

  return NextResponse.json({ message: body.id });
}

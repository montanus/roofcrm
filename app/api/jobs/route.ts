import { NextResponse } from "next/server";
import { getPool } from "@/app/libs/mysql";

export async function GET() {
  try {
    const db = getPool();
    const query = "select * from job";
    const [rows] = await db.execute(query);

    return NextResponse.json(rows);
  } catch (error) {
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
  console.log(body);

  try {
    const db = getPool();

    const [result] = await db.execute(
      "INSERT INTO job (customer_id, job_type, stage, contract_price, gdrive, job_desc, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        body.customer_id,
        body?.job_type ? body.job_type : "Shingle",
        body.stage ? body.stage : "Proposed",
        body.contract_price ? body.contract_price : 0,
        body.sort_order ? body.sort_order : "5",
        body.job_desc ? body.job_desc : "",
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
  console.log(body);
  try {
    const db = getPool();

    const [result] = await db.execute(
      "UPDATE customer SET job_type = ?, stage = ?, contract_price = ?, sort_order = ?, job_desc = ?, gdrive = ?, WHERE id = ?",
      [
        body?.job_type ? body.job_type : "Shingle",
        body.stage ? body.stage : "Proposed",
        body.contract_price ? body.contract_price : 0,
        body.sort_order ? body.sort_order : "5",
        body.job_desc ? body.job_desc : "",
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

  const db = getPool();
   const [result] = await db.execute("DELETE FROM customer WHERE id = ?", [
    body.id,
  ]);

  return NextResponse.json({ message: body.id });
}

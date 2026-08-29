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
        const query = 'select * from notes'
        const [rows] = await db.execute(query)
        
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB error:", error);

        return NextResponse.json({
            error: error
        }, { status: 500 })
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
      const [result,fields] = await db.execute('INSERT INTO notes (content, title, customer_id ) VALUES (?,?,?)', [body?.content, body.title? body.title :"", body?.customer_id]);   
  
      return NextResponse.json({ message: 'Data inserted successfully', id: result });
    } catch (error) {
      console.error('Error inserting data:', error);
      return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
    }
  }
  export async function PUT(request) {
    const body = await request.json();
    try {
    const db = getPool();
        const [result] = await db.execute('UPDATE notes SET content = ?, title = ? WHERE notes_id = ?', [body.content,body.title? body.title :"", body.notes_id]);    
  
        return NextResponse.json({ message: 'Data inserted successfully', id: result });
    } catch (error) {
      console.error('Error inserting data:', error);

      return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
    }
  }

  export async function DELETE(request) {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        {
          error: "You must be signed in to view the protected content on this page.", 
        },);
      }
    const body = await request.json();
    const db = getPool();
    const [result] = await db.execute('DELETE FROM notes WHERE note_id = ?', [body.note_id]);
    return NextResponse.json({ message: 'Data inserted successfully', id: result });
  }
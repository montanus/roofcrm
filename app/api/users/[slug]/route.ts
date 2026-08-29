import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/libs/mysql";
import { getServerSession } from "next-auth";


export async function GET(
    request:  NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug // user id
      const session = await getServerSession();
      if (!session) {
        return NextResponse.json(
          {
            error: "You must be signed in to view the protected content on this page.", 
          },);
        }
    try {
      const db = getPool();
        
        const query = 'select * from account where id = ?'
        const [rows] = await db.execute(query,[slug])
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}

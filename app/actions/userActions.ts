"use server"
import { getPool } from "@/app/libs/mysql";
import { User, Note } from "@/app/types";


export async function getAllUsers(): Promise<User[]> {

    const db = getPool();
    const query = "select * from customer";
    const [rows] = await db.execute(query);

    return rows as User[];
}





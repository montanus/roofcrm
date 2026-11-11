import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function getPool() {
  if (!global._mysqlPool) {
    // On Cloud Run, DB_SOCKET_PATH points at the Unix socket the platform
    // wires up for --add-cloudsql-instances (e.g. /cloudsql/PROJECT:REGION:INSTANCE).
    // Locally, DB_HOST/DB_PORT connect over TCP instead.
    const connection = process.env.DB_SOCKET_PATH
      ? { socketPath: process.env.DB_SOCKET_PATH }
      : { host: process.env.DB_HOST, port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined };

    global._mysqlPool = mysql.createPool({
      ...connection,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_SCHEMA,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return global._mysqlPool;
}

export const db = drizzle(getPool(), { schema, mode: "default" });

import mysql from 'mysql2/promise'


let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
        host: 'openhab.local',
        user: 'root',
        password: 'hal9000',
        database: 'reservation-sample',

        // user: 'root',
        // password: '2JI+fZhefvx:A$k}',
        // database: 'reservation-sample',
        // socketPath: '/cloudsql/olgadance-218922:us-east1:reservation',
        // waitForConnections: true,
        // connectionLimit: 5,              // keep small for Cloud Run
        // queueLimit: 0,
    });
  }
  return pool;
}


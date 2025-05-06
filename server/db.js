import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();


console.log("DATABASE_URL:", process.env.DATABASE_URL);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});


pool.connect()
    .then(client => {
        console.log('🟢 DB-anslutning lyckades');
        client.release();
    })
    .catch(err => {
        console.error('🔴 DB-anslutningsfel', err);

    });

export default pool;
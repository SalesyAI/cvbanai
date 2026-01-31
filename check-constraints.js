import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkConstraints() {
    console.log('Checking user table constraints...');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is missing!');
        return;
    }

    const url = new URL(connectionString);
    url.searchParams.delete('sslmode');
    const cleanConnStr = url.toString();

    const pool = new Pool({
        connectionString: cleanConnStr,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();

        const res = await client.query(`
            SELECT conname, pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conrelid = 'user'::regclass;
        `);

        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Constraint Check Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkConstraints();

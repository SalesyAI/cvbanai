import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
    console.log('Checking account table schema...');

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
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'account';
        `);

        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Schema Check Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();

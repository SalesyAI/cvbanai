import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function cleanSpecificUser() {
    console.log('Cleaning up specific user...');

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

        // Delete the specific user causing issues
        const res = await client.query(`
            DELETE FROM "user" WHERE email = 'salesyai.contact@gmail.com';
        `);

        console.log(`Deleted user salesyai.contact@gmail.com. Row count: ${res.rowCount}`);

        client.release();
    } catch (err) {
        console.error('Cleanup Failed:', err.message);
    } finally {
        await pool.end();
    }
}

cleanSpecificUser();

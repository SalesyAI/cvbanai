import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkGoogleAccounts() {
    console.log('Checking for Google accounts...');

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

        const res = await client.query(`SELECT * FROM "account" WHERE "providerId" = 'google'`);
        console.log(`Found ${res.rowCount} Google accounts.`);
        res.rows.forEach(row => {
            console.log(row);
        });

        client.release();
    } catch (err) {
        console.error('Check Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkGoogleAccounts();

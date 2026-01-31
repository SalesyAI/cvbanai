import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function addIdTokenColumn() {
    console.log('🚧 Adding idToken column to account table...');

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

        await client.query(`
            ALTER TABLE "account" 
            ADD COLUMN IF NOT EXISTS "idToken" TEXT;
        `);

        console.log('✅ Column idToken added successfully!');
        client.release();
    } catch (err) {
        console.error('Migration Failed:', err.message);
    } finally {
        await pool.end();
    }
}

addIdTokenColumn();

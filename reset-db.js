import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function resetDb() {
    console.log('⚠ WARNING: This will delete ALL users and authentication data! ⚠');
    console.log('Proceeding checking database connection...');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is missing!');
        return;
    }

    // Fix SSL mode for Supabase
    const url = new URL(connectionString);
    url.searchParams.delete('sslmode');
    const cleanConnStr = url.toString();

    const pool = new Pool({
        connectionString: cleanConnStr,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();

        console.log('Truncating tables...');
        // Order matters due to foreign keys. 
        // We use CASCADE to handle dependencies automatically, but explicit order is safer.
        await client.query(`
            TRUNCATE TABLE "session", "account", "verification", "user" RESTART IDENTITY CASCADE;
        `);

        console.log('✅ Database reset successfully. All users deleted.');
        client.release();
    } catch (err) {
        console.error('❌ Reset Failed:', err.message);
    } finally {
        await pool.end();
    }
}

resetDb();

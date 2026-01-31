import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function testFullFlow() {
    console.log('🧪 Testing Full Transaction (User + Account)...');

    // Setup connection
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

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create User
        console.log('Step 1: Inserting User...');
        const userRes = await client.query(`
            INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `, [
            'trans-test-user-' + Date.now(),
            'Transaction Test User',
            'trans.test@example.com',
            true,
            'https://lh3.googleusercontent.com/a/fake-image',
            new Date(),
            new Date()
        ]);
        const userId = userRes.rows[0].id;
        console.log('User Created:', userId);

        // 2. Create Account (Mimicking Google)
        console.log('Step 2: Inserting Account...');
        // Note: We need to match the schema columns exactly.
        const accountRes = await client.query(`
            INSERT INTO "account" (
                "id", 
                "userId", 
                "accountId", 
                "providerId", 
                "accessToken", 
                "refreshToken", 
                "createdAt", 
                "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `, [
            'trans-test-acc-' + Date.now(),
            userId,
            'google-sub-id-' + Date.now(), // Google's unique ID for the user
            'google',                      // Provider ID
            'fake-access-token',
            'fake-refresh-token',
            new Date(),
            new Date()
        ]);
        console.log('Account Created:', accountRes.rows[0].id);

        await client.query('COMMIT');
        console.log('✅ FULL TRANSACTION SUCCESS!');

        // Cleanup
        console.log('Cleaning up...');
        await client.query('DELETE FROM "user" WHERE id = $1', [userId]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ TRANSACTION FAILED!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Column:', err.column);
        console.error('Detail:', err.detail);
    } finally {
        client.release();
        await pool.end();
    }
}

testFullFlow();

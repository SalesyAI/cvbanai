import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function testGoogleInsert() {
    console.log('🧪 Testing Manual Google User Insertion...');

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

    // Mock Google User Data
    const mockUser = {
        id: 'manual-test-id-' + Date.now(),
        name: 'Manual Google Test',
        email: 'manual.google.test@example.com',
        emailVerified: true,
        image: 'https://lh3.googleusercontent.com/a/ACg8ocL-fake-image-url-that-is-standard-length-for-google-profiles=s96-c',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        const client = await pool.connect();

        console.log('Attempting INSERT...');
        const res = await client.query(`
            INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [
            mockUser.id,
            mockUser.name,
            mockUser.email,
            mockUser.emailVerified,
            mockUser.image,
            mockUser.createdAt,
            mockUser.updatedAt
        ]);

        console.log('✅ INSERT SUCCESSFUL!');
        console.log('Created User:', res.rows[0]);

        // Clean up
        console.log('Cleaning up test user...');
        await client.query('DELETE FROM "user" WHERE id = $1', [mockUser.id]);

        client.release();
    } catch (err) {
        console.error('❌ INSERT FAILED!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Detail:', err.detail);
        console.error('Schema/Table:', err.schema, err.table);
    } finally {
        await pool.end();
    }
}

testGoogleInsert();

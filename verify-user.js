import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyUser(email) {
    try {
        const result = await pool.query(
            `UPDATE "user" SET "emailVerified" = true WHERE "email" = $1 RETURNING *`,
            [email]
        );

        if (result.rowCount === 0) {
            console.log(`❌ User not found: ${email}`);
        } else {
            console.log(`✅ Successfully verified user: ${email}`);
            console.log('User details:', result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

const email = process.argv[2];
if (!email) {
    console.error('Usage: node verify-user.js <email>');
    process.exit(1);
}

verifyUser(email);

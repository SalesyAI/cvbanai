import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
    console.log('Checking all users...');
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
        const res = await client.query('SELECT * FROM "user"');
        console.log(`Total Users: ${res.rows.length}`);
        res.rows.forEach(user => {
            console.log(`- ${user.email} (ID: ${user.id}, Verified: ${user.emailVerified})`);
        });

        const accRes = await client.query('SELECT * FROM "account"');
        console.log(`Total Accounts: ${accRes.rows.length}`);
        accRes.rows.forEach(acc => {
            console.log(`- UserID: ${acc.userId}, Provider: ${acc.providerId}`);
        });

        client.release();
    } catch (err) {
        console.error('Check Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkUser();

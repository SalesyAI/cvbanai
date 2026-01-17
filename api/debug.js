import { Pool } from 'pg';

export default async function handler(req, res) {
    const checks = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        env: {
            // Check essential vars without exposing secrets
            hasDBUrl: !!process.env.DATABASE_URL,
            dbUrlStartsWith: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'MISSING',
            hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
            siteUrl: process.env.VITE_SITE_URL || process.env.BETTER_AUTH_URL
        },
        dependencies: {
            pg: 'unknown',
            authLib: 'unknown'
        },
        connection: {
            status: 'pending',
            error: null
        }
    };

    try {
        // 1. Check PG Dependency
        checks.dependencies.pg = 'loaded';

        // 2. Check Database Connection
        if (process.env.DATABASE_URL) {
            // FIX: Strip sslmode to allow rejectUnauthorized: false to work
            const url = new URL(process.env.DATABASE_URL);
            url.searchParams.delete('sslmode');
            const connectionString = url.toString();

            const pool = new Pool({
                connectionString: connectionString,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000 // 5s timeout
            });

            try {
                const client = await pool.connect();
                const result = await client.query('SELECT NOW()');
                client.release();
                await pool.end();

                checks.connection.status = 'success';
                checks.connection.time = result.rows[0].now;
            } catch (dbErr) {
                checks.connection.status = 'failed';
                checks.connection.error = dbErr.message;
            }
        } else {
            checks.connection.status = 'skipped_missing_url';
        }

        // 3. Check Auth Lib Import
        try {
            await import('../lib/auth.js');
            checks.dependencies.authLib = 'imported_successfully';
        } catch (importErr) {
            checks.dependencies.authLib = 'import_failed';
            checks.dependencies.authError = importErr.message;
            checks.dependencies.stack = importErr.stack;
        }

        res.status(200).json(checks);

    } catch (criticalErr) {
        res.status(500).json({
            error: 'Critical Test Failure',
            message: criticalErr.message,
            stack: criticalErr.stack,
            partialChecks: checks
        });
    }
}

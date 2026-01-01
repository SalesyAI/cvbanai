import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET request for testing
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'Webhook endpoint is live!',
            hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
            hasSheetId: !!process.env.GOOGLE_SHEET_ID
        });
    }

    // Only allow POST requests for actual webhooks
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Log the full incoming payload
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Supabase webhook payload structure
    const { record, type, table, schema } = req.body;

    console.log('Type:', type, 'Table:', table, 'Schema:', schema);

    // Only process INSERT events
    if (type !== 'INSERT') {
        console.log('Skipping non-INSERT event:', type);
        return res.status(200).json({ message: 'Skipped: Not an INSERT event', type });
    }

    // Check if record exists
    if (!record) {
        console.error('No record in payload');
        return res.status(400).json({ error: 'No record provided' });
    }

    console.log('Record:', JSON.stringify(record, null, 2));

    try {
        // Initialize auth
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        console.log('Config check:', {
            hasEmail: !!serviceAccountEmail,
            hasKey: !!privateKey,
            hasSheetId: !!sheetId,
            sheetId: sheetId
        });

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.error('Missing Google Sheets credentials');
            return res.status(500).json({
                error: 'Configuration error',
                hasEmail: !!serviceAccountEmail,
                hasKey: !!privateKey,
                hasSheetId: !!sheetId
            });
        }

        const auth = new JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        console.log('JWT auth created, connecting to sheet...');

        const doc = new GoogleSpreadsheet(sheetId, auth);

        // Load doc info
        await doc.loadInfo();
        console.log('Loaded Google Sheet:', doc.title);

        // Get the first sheet
        const sheet = doc.sheetsByIndex[0];
        console.log('Using sheet:', sheet.title);

        // Prepare row data - handles profiles table structure
        const bangladeshTime = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const rowData = {
            'Signup Date': bangladeshTime,
            'Name': record.full_name || record.raw_user_meta_data?.full_name || 'N/A',
            'Email': record.email || 'N/A'
        };


        console.log('Adding row:', JSON.stringify(rowData));

        // Append the row
        await sheet.addRow(rowData);

        console.log('=== SUCCESS: Row added to Google Sheets ===');
        return res.status(200).json({ message: 'Success', rowData });
    } catch (error) {
        console.error('=== ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}

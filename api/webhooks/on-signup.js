import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Log the incoming payload for debugging
    console.log('Webhook received:', JSON.stringify(req.body));

    // Supabase webhook payload structure
    const { record, type, table, schema } = req.body;

    // Only process INSERT events
    if (type !== 'INSERT') {
        console.log('Skipping non-INSERT event:', type);
        return res.status(200).json({ message: 'Skipped: Not an INSERT event' });
    }

    // Check if record exists
    if (!record) {
        console.error('No record in payload');
        return res.status(400).json({ error: 'No record provided' });
    }

    try {
        // Initialize auth
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.error('Missing Google Sheets credentials:', {
                hasEmail: !!serviceAccountEmail,
                hasKey: !!privateKey,
                hasSheetId: !!sheetId
            });
            return res.status(500).json({ error: 'Configuration error' });
        }

        const auth = new JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(sheetId, auth);

        // Load doc info
        await doc.loadInfo();
        console.log('Loaded Google Sheet:', doc.title);

        // Get the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Prepare row data - handle both auth.users and profiles table structures
        const rowData = {
            'Signup Date': record.created_at || record.confirmed_at || new Date().toISOString(),
            'User ID': record.id || record.user_id || 'N/A',
            'Email': record.email || record.raw_user_meta_data?.email || 'N/A',
            'Name': record.raw_user_meta_data?.full_name || record.full_name || record.raw_user_meta_data?.name || 'N/A',
            'Provider': record.raw_app_meta_data?.provider || record.app_metadata?.provider || 'email'
        };

        console.log('Adding row:', rowData);

        // Append the row
        await sheet.addRow(rowData);

        console.log('Successfully synced user to Google Sheets:', record.id);
        return res.status(200).json({ message: 'Success', rowData });
    } catch (error) {
        console.error('Error syncing to Google Sheets:', error.message, error.stack);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

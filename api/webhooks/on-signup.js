import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { record, type } = req.body;

    // Only process INSERT events
    if (type !== 'INSERT') {
        return res.status(200).json({ message: 'Skipped: Not an INSERT event' });
    }

    try {
        // Initialize auth
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.error('Missing Google Sheets credentials');
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

        // Get the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Prepare row data
        // Supabase payload structure: { record: { ... }, type: 'INSERT', ... }
        const rowData = {
            'Signup Date': record.created_at || new Date().toISOString(),
            'User ID': record.id,
            'Email': record.email || record.user_metadata?.email || 'N/A',
            'Name': record.full_name || record.user_metadata?.full_name || 'N/A',
            'Provider': record.raw_app_meta_data?.provider || 'email'
        };

        // Append the row
        await sheet.addRow(rowData);

        console.log('Successfully synced user to Google Sheets:', record.id);
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error syncing to Google Sheets:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

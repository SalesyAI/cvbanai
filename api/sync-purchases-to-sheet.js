import { createClient } from '@supabase/supabase-js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * GET /api/sync-purchases-to-sheet
 * One-time sync endpoint to update Google Sheet with existing purchase data
 * 
 * Run this once to populate the sheet with historical purchases
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check required env vars
    if (!process.env.GOOGLE_SHEET_ID) {
        return res.status(500).json({ error: 'GOOGLE_SHEET_ID not configured' });
    }

    try {
        // Initialize Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Initialize Google Sheets
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        const auth = new JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Fetch all completed purchases
        const { data: purchases, error: purchaseError } = await supabase
            .from('purchases')
            .select('*')
            .eq('status', 'completed');

        if (purchaseError) {
            throw new Error(`Failed to fetch purchases: ${purchaseError.message}`);
        }

        console.log(`[Sync] Found ${purchases?.length || 0} completed purchases`);

        if (!purchases || purchases.length === 0) {
            return res.status(200).json({
                message: 'No completed purchases found to sync',
                synced: 0
            });
        }

        // Load existing sheet rows
        const rows = await sheet.getRows();
        const results = { updated: 0, added: 0, skipped: 0, errors: [] };

        // Process each purchase
        for (const purchase of purchases) {
            try {
                // Get user email
                let userEmail = null;
                if (purchase.user_id) {
                    const { data: { user } } = await supabase.auth.admin.getUserById(purchase.user_id);
                    userEmail = user?.email;
                }

                if (!userEmail) {
                    console.log(`[Sync] Skipped purchase ${purchase.id}: No user email found`);
                    results.skipped++;
                    continue;
                }

                // Get product name
                const productName = purchase.product_id === 'linkedin' ? 'LinkedIn Optimizer' :
                    purchase.product_id === 'portfolio' ? 'Portfolio Website' :
                        purchase.product_id || 'Unknown Package';

                // Get purchase time
                const purchaseTime = new Date(purchase.created_at).toLocaleString('en-GB', {
                    timeZone: 'Asia/Dhaka',
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true
                });

                // Get transaction ID from metadata
                const trxID = purchase.metadata?.trxID || purchase.payment_ref || 'N/A';

                // Find user row in sheet
                const userRow = rows.find(row => row.get('Email') === userEmail);

                if (userRow) {
                    // Update existing row
                    const existingPurchases = userRow.get('Purchased Packages') || '';
                    const newPurchase = `${productName} (${purchaseTime})`;

                    // Check if this purchase is already recorded
                    if (existingPurchases.includes(trxID) || existingPurchases.includes(purchaseTime)) {
                        console.log(`[Sync] Skipped ${userEmail}: Purchase already recorded`);
                        results.skipped++;
                        continue;
                    }

                    const updatedPurchases = existingPurchases
                        ? `${existingPurchases}, ${newPurchase}`
                        : newPurchase;

                    userRow.set('Purchased Packages', updatedPurchases);
                    userRow.set('Last Purchase Date', purchaseTime);
                    userRow.set('Last Transaction ID', trxID);
                    await userRow.save();

                    console.log(`[Sync] Updated ${userEmail}: ${productName}`);
                    results.updated++;
                } else {
                    // Add new row
                    await sheet.addRow({
                        'Email': userEmail,
                        'Name': 'N/A',
                        'Signup Date': 'Unknown',
                        'Purchased Packages': `${productName} (${purchaseTime})`,
                        'Last Purchase Date': purchaseTime,
                        'Last Transaction ID': trxID
                    });

                    console.log(`[Sync] Added ${userEmail}: ${productName}`);
                    results.added++;
                }
            } catch (err) {
                console.error(`[Sync] Error processing purchase ${purchase.id}:`, err.message);
                results.errors.push({ id: purchase.id, error: err.message });
            }
        }

        return res.status(200).json({
            message: 'Sync completed',
            totalPurchases: purchases.length,
            ...results
        });

    } catch (error) {
        console.error('[Sync Error]', error.message);
        return res.status(500).json({ error: error.message });
    }
}

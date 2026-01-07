import { createClient } from '@supabase/supabase-js';
import { executePayment } from '../../lib/payment/bkash.js';
import { notifyAdmin } from '../../lib/utils/adminNotify.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Updates Google Sheet with purchase information
 * Finds user by email and adds purchased package info
 */
async function updateSheetWithPurchase(email, productId, trxID) {
    if (!process.env.GOOGLE_SHEET_ID) {
        console.log('[Sheets] Skipped: No GOOGLE_SHEET_ID configured');
        return { status: 'Skipped' };
    }

    try {
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

        // Get product display name
        const productName = productId === 'linkedin' ? 'LinkedIn Optimizer' :
            productId === 'portfolio' ? 'Portfolio Website' : productId || 'Unknown Package';

        // Get Bangladesh time for purchase date
        const purchaseTime = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });

        // Load all rows to find user by email
        const rows = await sheet.getRows();
        const userRow = rows.find(row => row.get('Email') === email);

        if (userRow) {
            // Get existing purchases (if any) and append new one
            const existingPurchases = userRow.get('Purchased Packages') || '';
            const newPurchase = `${productName} (${purchaseTime})`;
            const updatedPurchases = existingPurchases
                ? `${existingPurchases}, ${newPurchase}`
                : newPurchase;

            userRow.set('Purchased Packages', updatedPurchases);
            userRow.set('Last Purchase Date', purchaseTime);
            userRow.set('Last Transaction ID', trxID);
            await userRow.save();

            console.log(`[Sheets] Updated purchase for ${email}: ${productName}`);
            return { status: 'Success', action: 'updated' };
        } else {
            // User not found - add new row with purchase info
            await sheet.addRow({
                'Email': email,
                'Name': 'N/A',  // Will be unknown since we only have email
                'Signup Date': 'Unknown',
                'Purchased Packages': `${productName} (${purchaseTime})`,
                'Last Purchase Date': purchaseTime,
                'Last Transaction ID': trxID
            });

            console.log(`[Sheets] Added new row for ${email} with purchase: ${productName}`);
            return { status: 'Success', action: 'added' };
        }
    } catch (err) {
        console.error('[Sheets Purchase Error]', err.message);
        return { status: 'Failed', error: err.message };
    }
}

/**
 * GET /api/payment/callback
 * bKash redirects here after user authorizes payment
 * 
 * Query params: paymentID, status
 * Redirects to: /dashboard?payment=success|failed
 */
export default async function handler(req, res) {
    // Only GET (bKash redirects via GET)
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentID, status, resumeId, productId } = req.query;

    // Frontend redirect URL
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Build base redirect URL
    const getRedirectURL = (params) => {
        const url = new URL(`${baseURL}/dashboard`);
        Object.entries(params).forEach(([key, val]) => {
            if (val) url.searchParams.append(key, val);
        });
        if (resumeId) url.searchParams.append('resumeId', resumeId);
        if (productId) url.searchParams.append('productId', productId);
        return url.toString();
    };

    if (!paymentID) {
        return res.redirect(getRedirectURL({ payment: 'error', message: 'Missing paymentID' }));
    }

    // Handle cancelled/failed payments
    if (status === 'cancel' || status === 'failure') {
        console.log(`[Payment] Cancelled/Failed: ${paymentID}`);

        // Update database status
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        await supabase
            .from('purchases')
            .update({ status: 'failed' })
            .eq('payment_ref', paymentID);

        return res.redirect(getRedirectURL({ payment: 'cancelled' }));
    }

    try {
        // Execute the payment (confirm it)
        const result = await executePayment(paymentID);

        console.log(`[Payment] Executed: ${paymentID}, trxID: ${result.trxID}`);

        // Update database with success
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // First, get the purchase record to find user info
        const { data: purchaseData } = await supabase
            .from('purchases')
            .select('user_id')
            .eq('payment_ref', paymentID)
            .single();

        // Update purchase status
        await supabase
            .from('purchases')
            .update({
                status: 'completed',
                metadata: {
                    trxID: result.trxID,
                    customerMsisdn: result.customerMsisdn,
                    completedAt: new Date().toISOString()
                }
            })
            .eq('payment_ref', paymentID);

        // Get user email for Google Sheets update
        let userEmail = null;
        if (purchaseData?.user_id) {
            const { data: userData } = await supabase
                .from('auth.users')
                .select('email')
                .eq('id', purchaseData.user_id)
                .single();

            if (!userData?.email) {
                // Try using supabase admin auth API
                const { data: { user } } = await supabase.auth.admin.getUserById(purchaseData.user_id);
                userEmail = user?.email;
            } else {
                userEmail = userData.email;
            }
        }

        // Update Google Sheets with purchase info
        if (userEmail) {
            try {
                await updateSheetWithPurchase(userEmail, productId, result.trxID);
            } catch (err) {
                console.error('[Sheets Update Error]', err.message);
            }
        } else {
            console.log('[Sheets] Skipped: Could not find user email');
        }

        // Notify Admin of successful purchase
        try {
            const productName = productId === 'linkedin' ? 'LinkedIn Optimizer' :
                productId === 'portfolio' ? 'Portfolio Website' : 'Premium Package';
            const price = productId === 'linkedin' ? '500 TK' :
                productId === 'portfolio' ? '1000 TK' : 'Unknown';

            await notifyAdmin(
                `**Product:** ${productName}\n**Amount:** ${price}\n**TrxID:** ${result.trxID}\n**Customer:** ${result.customerMsisdn || 'Unknown'}`,
                'success'
            );
        } catch (err) {
            console.error('[AdminNotify Error]', err.message);
        }

        // Redirect to success
        return res.redirect(getRedirectURL({ payment: 'success', trxID: result.trxID }));

    } catch (error) {
        console.error('[Payment Callback Error]', error.message);

        // Update database with failure
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        await supabase
            .from('purchases')
            .update({
                status: 'failed',
                metadata: { error: error.message }
            })
            .eq('payment_ref', paymentID);

        return res.redirect(getRedirectURL({ payment: 'failed', message: error.message }));
    }
}

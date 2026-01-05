import { createClient } from '@supabase/supabase-js';
import { executePayment } from '../../lib/payment/bkash.js';

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

    const { paymentID, status } = req.query;

    // Frontend redirect URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
        'http://localhost:5173';

    if (!paymentID) {
        return res.redirect(`${baseURL}/dashboard?payment=error&message=Missing+paymentID`);
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

        return res.redirect(`${baseURL}/dashboard?payment=cancelled`);
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

        // Redirect to success
        return res.redirect(`${baseURL}/dashboard?payment=success&trxID=${result.trxID}`);

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

        return res.redirect(`${baseURL}/dashboard?payment=failed&message=${encodeURIComponent(error.message)}`);
    }
}

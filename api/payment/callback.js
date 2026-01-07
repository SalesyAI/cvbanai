import { createClient } from '@supabase/supabase-js';
import { executePayment } from '../../lib/payment/bkash.js';
import { notifyAdmin } from '../../lib/utils/adminNotify.js';

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

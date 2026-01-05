import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/payment/verify
 * Check if a user has purchased a specific product
 * 
 * Body: { userId: 'uuid', productId: 'pdf' }
 * Returns: { hasPurchased: true/false, purchaseDate: '...' }
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Missing userId or productId' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Check for completed purchase
        const { data: purchase, error } = await supabase
            .from('purchases')
            .select('id, created_at, amount, metadata')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
            throw error;
        }

        if (purchase) {
            return res.status(200).json({
                hasPurchased: true,
                purchaseId: purchase.id,
                purchaseDate: purchase.created_at,
                amount: purchase.amount,
                trxID: purchase.metadata?.trxID
            });
        }

        return res.status(200).json({
            hasPurchased: false
        });

    } catch (error) {
        console.error('[Payment Verify Error]', error.message);
        return res.status(500).json({ error: 'Verification failed' });
    }
}

import { createClient } from '@supabase/supabase-js';
import { createPayment } from '../../lib/payment/bkash.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/payment/create
 * Initiates a bKash payment session
 * 
 * Body: { productId: 'pdf', userId: 'uuid' }
 * Returns: { bkashURL: 'https://checkout.bka.sh/...' }
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
        const { productId, userId, resumeId } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({ error: 'Missing productId or userId' });
        }

        // Product pricing (only premium services)
        const products = {
            'linkedin': { name: 'LinkedIn Optimizer', amount: 500 },
            'portfolio': { name: 'Portfolio Website', amount: 1000 }
        };

        const product = products[productId];
        if (!product) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Generate unique invoice number
        const invoiceNumber = `CVB-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Get callback URL
        const host = req.headers.host;
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

        // Append productId and resumeId to callbackURL
        let callbackURL = `${baseURL}/api/payment/callback?productId=${productId}`;
        if (resumeId) {
            callbackURL += `&resumeId=${resumeId}`;
        }

        // Create bKash payment
        const { paymentID, bkashURL } = await createPayment({
            amount: product.amount,
            invoiceNumber,
            callbackURL
        });

        // Save pending payment to database
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        await supabase.from('purchases').insert({
            user_id: userId,
            product_id: productId,
            amount: product.amount,
            currency: 'BDT',
            status: 'pending',
            payment_provider: 'bkash',
            payment_ref: paymentID,
            metadata: { invoiceNumber, productName: product.name }
        });

        console.log(`[Payment] Created bKash payment: ${paymentID} for user ${userId}`);

        return res.status(200).json({
            success: true,
            paymentID,
            bkashURL,
            invoiceNumber
        });

    } catch (error) {
        console.error('[Payment Create Error]', error.message);
        return res.status(500).json({ error: error.message || 'Payment creation failed' });
    }
}

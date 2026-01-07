import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { refineResume } from './gemini.js';
import { createPayment, executePayment } from '../lib/payment/bkash.js';

// Load environment variables
dotenv.config();

// Supabase client (used for payment routes)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Supabase URL or Key is missing! Check your .env file.');
} else if (!process.env.SUPABASE_SERVICE_KEY) {
    console.warn('WARNING: SUPABASE_SERVICE_KEY is missing. Using ANON_KEY as fallback. Some admin operations might fail.');
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume refinement endpoint
app.post('/api/refine', async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ error: 'Missing resumeData in request body' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured. Please add it to your .env file.' });
        }

        console.log('Refining resume for:', resumeData.fullName);

        const refinedData = await refineResume(resumeData, process.env.GEMINI_API_KEY);

        console.log('Refinement complete!');
        res.json({ refinedData });
    } catch (error) {
        console.error('Refinement error:', error);
        res.status(500).json({ error: error.message || 'Failed to refine resume' });
    }
});

/**
 * Payment Endpoints (Local dev support)
 */

// 1. Create bKash Payment
app.post('/api/payment/create', async (req, res) => {
    try {
        const { productId, userId, resumeId } = req.body;
        if (!productId || !userId) return res.status(400).json({ error: 'Missing details' });

        const products = {
            'pdf': { name: 'PDF Export', amount: 200 },
            'linkedin': { name: 'LinkedIn Optimization', amount: 500 },
            'portfolio': { name: 'Portfolio Builder', amount: 1000 }
        };

        const product = products[productId];
        const invoiceNumber = `CVB-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Use local or Vercel URL
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173';
        let callbackURL = `http://localhost:3001/api/payment/callback?productId=${productId}`;
        if (resumeId) callbackURL += `&resumeId=${resumeId}`;

        const { paymentID, bkashURL } = await createPayment({
            amount: product.amount,
            invoiceNumber,
            callbackURL
        });

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

        res.json({ success: true, bkashURL });
    } catch (error) {
        console.error('Payment create error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. bKash Callback
app.get('/api/payment/callback', async (req, res) => {
    const { paymentID, status, resumeId, productId } = req.query;
    const baseURL = 'http://localhost:5173'; // Always redirect back to Vite dev server

    const getRedirectURL = (params) => {
        const url = new URL(`${baseURL}/dashboard`);
        Object.entries(params).forEach(([key, val]) => {
            if (val) url.searchParams.append(key, val);
        });
        if (resumeId) url.searchParams.append('resumeId', resumeId);
        if (productId) url.searchParams.append('productId', productId);
        return url.toString();
    };

    if (!paymentID || status === 'cancel' || status === 'failure') {
        return res.redirect(getRedirectURL({ payment: 'cancelled' }));
    }

    try {
        const result = await executePayment(paymentID);
        await supabase.from('purchases').update({
            status: 'completed',
            metadata: { trxID: result.trxID, completedAt: new Date().toISOString() }
        }).eq('payment_ref', paymentID);

        res.redirect(getRedirectURL({ payment: 'success', trxID: result.trxID }));
    } catch (error) {
        console.error('Callback error:', error);
        res.redirect(getRedirectURL({ payment: 'failed', message: error.message }));
    }
});

// 3. Verify Purchase
app.post('/api/payment/verify', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const { data: purchase } = await supabase
            .from('purchases')
            .select('id, created_at, metadata')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('status', 'completed')
            .limit(1)
            .single();

        res.json({ hasPurchased: !!purchase, purchaseDate: purchase?.created_at });
    } catch (error) {
        res.json({ hasPurchased: false });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 CVBanai AI Server                        ║
║                                               ║
║   Running on: http://localhost:${PORT}          ║
║   API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}                  ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

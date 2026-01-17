import { createClient } from '@supabase/supabase-js';
import { notifyAdmin } from '../lib/utils/adminNotify.js';
import { requireAuth } from '../lib/auth-utils.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // ========== AUTHENTICATION (BetterAuth) ==========
        const user = await requireAuth(req, res);
        if (!user) return;

        const { whatsapp } = req.body;

        if (!whatsapp) {
            return res.status(400).json({ error: 'Missing WhatsApp number' });
        }

        // ========== DATABASE OPERATIONS (Supabase) ==========
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
        );

        // Update the user's portfolio purchase with the WhatsApp number
        const { error: updateError } = await supabase
            .from('purchases')
            .update({
                metadata: supabase.rpc('jsonb_set', {
                    target: 'metadata',
                    path: '{whatsapp}',
                    value: JSON.stringify(whatsapp)
                })
            })
            .eq('user_id', user.id)
            .eq('product_id', 'portfolio')
            .eq('status', 'completed');

        // Fallback: Just insert a new record if update fails
        if (updateError) {
            // Use raw update with existing metadata merge
            const { data: purchase } = await supabase
                .from('purchases')
                .select('id, metadata')
                .eq('user_id', user.id)
                .eq('product_id', 'portfolio')
                .eq('status', 'completed')
                .single();

            if (purchase) {
                await supabase
                    .from('purchases')
                    .update({
                        metadata: { ...purchase.metadata, whatsapp, contactRequested: new Date().toISOString() }
                    })
                    .eq('id', purchase.id);
            }
        }

        console.log(`[Portfolio] WhatsApp ${whatsapp} saved for user ${user.id}`);

        // Notify Admin of new lead
        try {
            await notifyAdmin(
                `**New Portfolio Lead!**\n**WhatsApp:** ${whatsapp}\n**User ID:** ${user.id}\n**Email:** ${user.email}`,
                'info'
            );
        } catch (err) {
            console.error('[AdminNotify Error]', err.message);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('[Portfolio] Error:', error.message);
        return res.status(500).json({ error: `Failed to save contact info: ${error.message}` });
    }
}

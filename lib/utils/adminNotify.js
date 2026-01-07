/**
 * Admin Notification Utility
 * Sends alerts to Discord via webhooks for new purchases and leads.
 */
export async function notifyAdmin(message, type = 'info') {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('[AdminNotify] No DISCORD_WEBHOOK_URL found in environment.');
        return;
    }

    const colors = {
        success: 0x22c55e, // Green
        warning: 0xf59e0b, // Amber
        error: 0xef4444,   // Red
        info: 0x3b82f6     // Blue
    };

    const payload = {
        embeds: [{
            title: type === 'success' ? '🚀 New Sale!' : '🔔 Update',
            description: message,
            color: colors[type] || colors.info,
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.statusText}`);
        }
    } catch (error) {
        console.error('[AdminNotify] Failed to send notification:', error.message);
    }
}

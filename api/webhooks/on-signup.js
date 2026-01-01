import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET request for testing
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'Webhook endpoint is live!',
            hasSheetEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            hasGmailUser: !!process.env.GMAIL_USER,
            hasDiscord: !!process.env.DISCORD_WEBHOOK_URL
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse payload
    const { record, type } = req.body;

    if (type !== 'INSERT' || !record) {
        return res.status(200).json({ message: 'Skipped: Not a valid INSERT event' });
    }

    console.log('Processing signup for:', record.email);

    // Prepare data
    const bangladeshTime = new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Dhaka',
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const userData = {
        'Signup Date': bangladeshTime,
        'Name': record.full_name || record.raw_user_meta_data?.full_name || 'N/A',
        'Email': record.email || 'N/A'
    };

    const results = {
        sheets: 'Skipped',
        email: 'Skipped',
        discord: 'Skipped'
    };

    try {
        // 1. Google Sheets Sync
        if (process.env.GOOGLE_SHEET_ID) {
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
                await sheet.addRow(userData);
                results.sheets = 'Success';
            } catch (err) {
                console.error('Sheets Error:', err.message);
                results.sheets = 'Failed';
            }
        }

        // 2. Discord Notification
        if (process.env.DISCORD_WEBHOOK_URL) {
            try {
                await fetch(process.env.DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        embeds: [{
                            title: "🚀 New User Signup!",
                            color: 0x00ff00, // Green
                            fields: [
                                { name: "Name", value: userData.Name, inline: true },
                                { name: "Email", value: userData.Email, inline: true },
                                { name: "Time", value: userData['Signup Date'], inline: false }
                            ],
                            footer: { text: "CVBanai System Alert" }
                        }]
                    })
                });
                results.discord = 'Success';
            } catch (err) {
                console.error('Discord Error:', err.message);
                results.discord = 'Failed';
            }
        }

        // 3. Gmail Notification
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_APP_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: process.env.GMAIL_USER, // Send to self
                    subject: `New Signup: ${userData.Name}`,
                    html: `
                        <h2>🚀 New User Signup</h2>
                        <p><strong>Name:</strong> ${userData.Name}</p>
                        <p><strong>Email:</strong> ${userData.Email}</p>
                        <p><strong>Time:</strong> ${userData['Signup Date']}</p>
                    `
                });
                results.email = 'Success';
            } catch (err) {
                console.error('Email Error:', err.message);
                results.email = 'Failed';
            }
        }

        return res.status(200).json({ message: 'Processed', results });

    } catch (error) {
        console.error('Handler critical error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

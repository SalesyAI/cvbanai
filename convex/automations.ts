"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// Trigger automations on new signup
export const notifyNewSignup = action({
    args: {
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const bangladeshTime = new Date().toLocaleString("en-GB", {
            timeZone: "Asia/Dhaka",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const userData = {
            "Signup Date": bangladeshTime,
            Name: args.name,
            Email: args.email,
        };

        const results = {
            sheets: "Skipped",
            discord: "Skipped",
            email: "Skipped",
        };

        try {
            // Google Sheets
            if (process.env.GOOGLE_SHEET_ID) {
                try {
                    const { GoogleSpreadsheet } = await import("google-spreadsheet");
                    const { JWT } = await import("google-auth-library");

                    const auth = new JWT({
                        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                    });

                    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
                    await doc.loadInfo();
                    await doc.sheetsByIndex[0].addRow(userData);
                    results.sheets = "Success";
                } catch (err: any) {
                    console.error("Sheets Error:", err.message);
                    results.sheets = "Failed";
                }
            }

            // Discord Notification
            if (process.env.DISCORD_WEBHOOK_URL) {
                try {
                    await fetch(process.env.DISCORD_WEBHOOK_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            embeds: [
                                {
                                    title: "🚀 New User Signup!",
                                    color: 0x00ff00,
                                    fields: [
                                        { name: "Name", value: userData.Name, inline: true },
                                        { name: "Email", value: userData.Email, inline: true },
                                        {
                                            name: "Time",
                                            value: userData["Signup Date"],
                                            inline: false,
                                        },
                                    ],
                                    footer: { text: "CVBanai System Alert" },
                                },
                            ],
                        }),
                    });
                    results.discord = "Success";
                } catch (err: any) {
                    console.error("Discord Error:", err.message);
                    results.discord = "Failed";
                }
            }

            // Gmail Notification
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
                try {
                    const nodemailer = await import("nodemailer");

                    const transporter = nodemailer.default.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_APP_PASSWORD,
                        },
                    });

                    await transporter.sendMail({
                        from: process.env.GMAIL_USER,
                        to: process.env.GMAIL_USER,
                        subject: `New Signup: ${userData.Name}`,
                        html: `
              <h2>🚀 New User Signup</h2>
              <p><strong>Name:</strong> ${userData.Name}</p>
              <p><strong>Email:</strong> ${userData.Email}</p>
              <p><strong>Time:</strong> ${userData["Signup Date"]}</p>
            `,
                    });
                    results.email = "Success";
                } catch (err: any) {
                    console.error("Email Error:", err.message);
                    results.email = "Failed";
                }
            }

            return { success: true, results };
        } catch (error: any) {
            console.error("Automation error:", error);
            return { success: false, error: error.message };
        }
    },
});

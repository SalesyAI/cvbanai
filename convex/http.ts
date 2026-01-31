import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Clerk Webhook Handler
http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const payload = await request.json();
        const eventType = payload.type;

        if (eventType === "user.created" || eventType === "user.updated") {
            const { id, email_addresses, first_name, last_name, image_url } = payload.data;

            // Sync user to Convex
            await ctx.runMutation(api.users.syncUser, {
                clerkId: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
                imageUrl: image_url,
            });

            // Trigger automations only for new signups
            if (eventType === "user.created") {
                await ctx.runAction(api.automations.notifyNewSignup, {
                    email: email_addresses[0].email_address,
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "New User",
                });
            }
        }

        return new Response(null, { status: 200 });
    }),
});

// bKash Payment Callback
http.route({
    path: "/bkash/callback",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const url = new URL(request.url);
        const paymentID = url.searchParams.get("paymentID");
        const status = url.searchParams.get("status");

        if (status === "success" && paymentID) {
            await ctx.runMutation(api.payments.completePurchase, {
                paymentRef: paymentID,
            });
        }

        // Redirect to frontend
        const siteUrl = process.env.VITE_SITE_URL || "http://localhost:5173";
        return new Response(null, {
            status: 302,
            headers: {
                Location: status === "success"
                    ? `${siteUrl}/dashboard?payment=success`
                    : `${siteUrl}/dashboard?payment=failed`
            },
        });
    }),
});

export default http;

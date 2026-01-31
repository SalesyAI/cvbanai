import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a purchase record
export const createPurchase = mutation({
    args: {
        userId: v.id("users"),
        productId: v.string(),
        amount: v.number(),
        paymentRef: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("purchases", {
            ...args,
            currency: "BDT",
            status: "pending",
            paymentProvider: "bkash",
            metadata: {},
            createdAt: Date.now(),
        });
    },
});

// Complete a purchase
export const completePurchase = mutation({
    args: { paymentRef: v.string() },
    handler: async (ctx, args) => {
        const purchase = await ctx.db
            .query("purchases")
            .withIndex("by_payment_ref", (q) => q.eq("paymentRef", args.paymentRef))
            .unique();

        if (purchase) {
            await ctx.db.patch(purchase._id, {
                status: "completed",
                metadata: { completedAt: Date.now() }
            });
        }

        return purchase;
    },
});

// Check if user has purchased a product
export const verifyPurchase = query({
    args: {
        userId: v.id("users"),
        productId: v.string(),
    },
    handler: async (ctx, args) => {
        const purchase = await ctx.db
            .query("purchases")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("productId"), args.productId),
                    q.eq(q.field("status"), "completed")
                )
            )
            .first();

        return {
            hasPurchased: !!purchase,
            purchaseDate: purchase?.createdAt,
        };
    },
});

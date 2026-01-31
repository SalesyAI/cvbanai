import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users (synced from Clerk)
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"]),

    // Resumes
    resumes: defineTable({
        userId: v.id("users"),
        fullName: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        location: v.optional(v.string()),
        summary: v.optional(v.string()),
        experience: v.any(),
        education: v.any(),
        skills: v.array(v.string()),
        projects: v.optional(v.any()),
        certifications: v.optional(v.any()),
        languages: v.optional(v.any()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_user", ["userId"]),

    // Purchases
    purchases: defineTable({
        userId: v.id("users"),
        productId: v.string(),
        amount: v.number(),
        currency: v.string(),
        status: v.string(),
        paymentProvider: v.string(),
        paymentRef: v.string(),
        metadata: v.any(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_payment_ref", ["paymentRef"]),
});

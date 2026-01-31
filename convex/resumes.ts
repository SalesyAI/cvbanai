import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new resume
export const create = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("resumes", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Get all resumes for a user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("resumes")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    },
});

// Get a single resume by ID
export const getById = query({
    args: { id: v.id("resumes") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Update a resume
export const update = mutation({
    args: {
        id: v.id("resumes"),
        fullName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        location: v.optional(v.string()),
        summary: v.optional(v.string()),
        experience: v.optional(v.any()),
        education: v.optional(v.any()),
        skills: v.optional(v.array(v.string())),
        projects: v.optional(v.any()),
        certifications: v.optional(v.any()),
        languages: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

// Delete a resume
export const deleteResume = mutation({
    args: { id: v.id("resumes") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

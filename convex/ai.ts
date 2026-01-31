import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Generate full resume using AI
export const generateFullResume = action({
    args: {
        clerkId: v.string(),
        quickInput: v.any(),
    },
    handler: async (ctx, args) => {
        // Get user
        const user = await ctx.runQuery(api.users.getCurrentUser, {
            clerkId: args.clerkId,
        });

        if (!user) throw new Error("User not found");

        // Import AI function
        const { generateFullResume: generateFn } = await import("../lib/ai/generateFullResume.js");
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

        // Generate resume
        const resumeData = await generateFn(args.quickInput, geminiApiKey);

        // Save to database
        await ctx.runMutation(api.resumes.create, {
            userId: user._id,
            fullName: resumeData.fullName,
            email: resumeData.email,
            phone: resumeData.phone,
            location: resumeData.location,
            summary: resumeData.summary,
            experience: resumeData.experience,
            education: resumeData.education,
            skills: resumeData.skills,
            projects: resumeData.projects,
            certifications: resumeData.certifications,
            languages: resumeData.languages,
        });

        return { success: true, resumeData };
    },
});

// Refine resume using AI
export const refineResume = action({
    args: {
        resumeData: v.any(),
    },
    handler: async (ctx, args) => {
        const { refineResume: refineFn } = await import("../server/gemini.js");
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

        const refinedData = await refineFn(args.resumeData, geminiApiKey);
        return { refinedData };
    },
});

// Generate cover letter
export const generateCoverLetter = action({
    args: {
        resumeData: v.any(),
        jobDescription: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { generateCoverLetter: generateFn } = await import("../lib/ai/generateCoverLetter.js");
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

        return await generateFn(args.resumeData, args.jobDescription, geminiApiKey);
    },
});

// Calculate ATS score
export const calculateAtsScore = action({
    args: {
        resumeData: v.any(),
        jobDescription: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { calculateAtsScore: calculateFn } = await import("../lib/ai/calculateAtsScore.js");
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

        return await calculateFn(args.resumeData, args.jobDescription, geminiApiKey);
    },
});

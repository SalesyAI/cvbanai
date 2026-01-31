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
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

        // Use Gemini API directly for refinement
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Refine the following resume data to make it more professional and ATS-friendly. Return the refined data in the same JSON format:
        
${JSON.stringify(args.resumeData, null, 2)}

Enhance:
- Summary: Make it more impactful
- Work history descriptions: Use action verbs
- Keep the same structure

Return only valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const refinedData = jsonMatch ? JSON.parse(jsonMatch[0]) : args.resumeData;

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

import { supabase } from '../lib/supabase'

export const resumeService = {
    // Create a new resume
    async createResume(userId, resumeData) {
        const { data, error } = await supabase
            .from('resumes')
            .insert([{
                user_id: userId,
                title: resumeData.fullName ? `${resumeData.fullName}'s Resume` : 'Untitled Resume',
                content: resumeData,
                status: 'draft',
                updated_at: new Date().toISOString()
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Get all resumes for the current user
    async getUserResumes() {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .order('updated_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Get a single resume by ID
    async getResumeById(id) {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Update an existing resume
    async updateResume(id, updates) {
        const { data, error } = await supabase
            .from('resumes')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Delete a resume
    async deleteResume(id) {
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

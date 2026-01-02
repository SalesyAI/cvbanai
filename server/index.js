import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { refineResume } from './gemini.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['POST'],
    credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume refinement endpoint
app.post('/api/refine', async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ error: 'Missing resumeData in request body' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured. Please add it to your .env file.' });
        }

        console.log('Refining resume for:', resumeData.fullName);

        const refinedData = await refineResume(resumeData, process.env.GEMINI_API_KEY);

        console.log('Refinement complete!');
        res.json({ refinedData });
    } catch (error) {
        console.error('Refinement error:', error);
        res.status(500).json({ error: error.message || 'Failed to refine resume' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 CVBanai AI Server                        ║
║                                               ║
║   Running on: http://localhost:${PORT}          ║
║   API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}                  ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

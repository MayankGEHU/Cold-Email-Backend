import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateColdEmail } from './services/groqAgent.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://cold-email-ai-agent-frontend.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Email generation endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const email = await generateColdEmail(prompt);
    res.json({ email });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Failed to generate cold email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

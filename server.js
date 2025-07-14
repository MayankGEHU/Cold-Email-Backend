import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { generateColdEmail } from './services/groqAgent.js';

dotenv.config();

const app = express();

// ✅ Allowed Frontend Origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://cold-email-ai-agent-frontend.vercel.app',
];

// ✅ CORS Config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

/* -------------------------- Cold Email Generation -------------------------- */
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const email = await generateColdEmail(prompt);
    res.json({ email });
  } catch (error) {
    console.error('Error generating email:', error.message);
    res.status(500).json({ error: 'Failed to generate cold email' });
  }
});

app.post('/api/sendEmail', async (req, res) => {
  const { senderName, from, to, subject, text } = req.body;

  // ✅ Input validation
  if (!senderName || !from || !to || !subject || !text) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Send email with user name as display name
    await transporter.sendMail({
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: `From: ${from}\n\n${text}`, // user email is shown inside body
      replyTo: from, // reply goes to user's input email
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

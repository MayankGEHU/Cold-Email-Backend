import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// ✅ Allowed frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'https://cold-email-ai-agent-frontend.vercel.app',
];

// ✅ CORS setup
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

/* -------------------------- Email Sending Endpoint -------------------------- */
app.post('/api/sendEmail', async (req, res) => {
  const { senderName, from, to, subject, text } = req.body;

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

    await transporter.sendMail({
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: `From: ${from}\n\n${text}`,
      replyTo: from,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

/* ------------------------------ Server Start ------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

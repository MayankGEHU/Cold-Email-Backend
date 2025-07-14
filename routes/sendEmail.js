import nodemailer from 'nodemailer'; // at top

app.post('/api/sendEmail', async (req, res) => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !subject || !text) {
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

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error("❌ Email error:", error); // Add this!
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

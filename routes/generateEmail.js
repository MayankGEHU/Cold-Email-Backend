const express = require('express');
const { generateColdEmail } = require('../services/groqAgent');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    const email = await generateColdEmail(prompt);
    res.json({ email });
  } catch (err) {
    console.error('Groq Error:', err.message);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

module.exports = router;

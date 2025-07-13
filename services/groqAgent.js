import fetch from 'node-fetch';

export async function generateColdEmail(prompt) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', 
        messages: [
          {
            role: 'system',
            content: 'You are ColdMail Genius, an expert in writing short, high-converting cold emails based on job descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.error('Groq API raw response:', data);
      throw new Error('Invalid response structure from Groq API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq Error:', error.message);
    throw new Error('Failed to generate cold email');
  }
}

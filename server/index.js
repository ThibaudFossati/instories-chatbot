import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message || '';
  const prompt = userMessage === '/projets'
    ? 'Parle des projets réalisés sur instories.fr en valorisant le rôle du directeur artistique.'
    : userMessage;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Pas de réponse.';
    res.json({ reply });
  } catch (err) {
    console.error('Erreur OpenAI:', err);
    res.status(500).json({ reply: '❌ Erreur côté assistant.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('InStories bot running on http://localhost:' + PORT));

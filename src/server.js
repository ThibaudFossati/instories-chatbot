import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const reply = await getBotResponse(userMessage);
    res.json({ reply });
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({ reply: '❌ Erreur serveur' });
  }
});

async function getBotResponse(message) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + OPENAI_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Pas de réponse.';
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('✅ Server running at http://localhost:' + PORT));

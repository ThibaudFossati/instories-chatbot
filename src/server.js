import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

// 🔐 Middlewares
app.use(cors());
app.use(express.json());

// 🛡️ Limitation des requêtes (anti-abus)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes / IP
  message: '🚫 Trop de requêtes – veuillez patienter un instant.'
});
app.use(limiter);

// 🔁 API principale
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

// 🧠 Fonction assistant
async function getBotResponse(message) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + OPENAI_API_KEY,
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

// 🔊 Lancement du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('✅ Server running at http://localhost:' + PORT);
});

// 📋 Profils créatifs (à utiliser dans assistant ou pour des suggestions)
const profils = {
  'Directeur Artistique': ['Stratégie visuelle', 'Moodboard', 'Direction de shooting'],
  'Social Media Manager': ['Calendrier éditorial', 'Idées de formats', 'Tonalité des posts'],
};

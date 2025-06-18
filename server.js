import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app  = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

/* Sert les fichiers Vite */
app.use(express.static(path.join(__dirname, 'dist')));

/* --------  API Chat  -------- */
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const userMsg = req.body.message || '';
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'VOTRE NOUVEAU MESSAGE SYSTÈME' },
        { role: 'user',   content: userMsg }
      ]
    });
    res.json({ reply: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Désolé, une erreur est survenue." });
  }
});

/* Catch-all : renvoie index.html */
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* Lancement */
app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
);

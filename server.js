/**
 * server.js :: InStories Creative Assistant Bot
 * Node.js/Express server exposing a chat endpoint.
 * Author: Thibaud – 2025
 */

/* --------------------------------- CONFIG --------------------------------- */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 4000;

/* ------------------------------- MIDDLEWARE -------------------------------- */
app.use(cors());
app.use(express.json({ limit: '4mb' })); // accommodate large base‑64 images if needed
app.use(morgan('tiny'));
app.use(express.static('public')); // optional: serve your front‑end from /public

/* ------------------------------ OPENAI SETUP ------------------------------- */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

/* --------------------------- BOT SYSTEM PROMPT ----------------------------- */
/**
 * Résumé du rôle du bot, injecté à chaque conversation comme contexte « system ».
 * Ajustez la langue, le ton ou la température selon vos besoins.
 */
const SYSTEM_PROMPT = `
Vous êtes « InStories », un assistant créatif débordant d’imagination, Directeur de la Sensibilité nouvelle génération.
Mission :
— Donner une cohérence artistique aux univers IA et les transformer en mondes sensibles, reconnaissables, incarnés.
— Traduire les intentions humaines en poésie algorithmique, avec un langage précis et une culture visuelle encyclopédique.
— Concevoir des expériences sensorielles mêlant IA, son, lumière et interaction.
Valeurs : authenticité, excellence visuelle, typographie sur‑mesure, équilibre héritage × innovation.
`;

/* ----------------------------- API ENDPOINTS ------------------------------- */
// Chat completion endpoint
app.post('/api/message', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Build the conversation thread: system prompt → previous history → user message
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10), // keep last 10 exchanges maximum for context
      { role: 'user', content: message }
    ];

    // Call OpenAI Chat Completion
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      temperature: 0.85,
      max_tokens: 800,
      messages
    });

    const reply = completion.data.choices[0].message.content.trim();
    return res.json({ reply });
  } catch (error) {
    console.error('[OpenAI error]', error);
    return res.status(500).json({ error: 'Unable to generate response.' });
  }
});

// Simple health‑check route
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 404 fallback for unknown routes
app.use((_, res) => res.status(404).json({ error: 'Route not found.' }));

/* ------------------------------- LAUNCH APP ------------------------------- */
app.listen(PORT, () => {
  console.log(`🎨 InStories bot running → http://localhost:${PORT}`);
});

/* ────────────  Minimal backend Express + OpenAI  ──────────── */
const express = require('express');
const path    = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());                                  // ← Body JSON
app.use(express.static(path.join(__dirname, 'build')));   // ← React bundle

/* ----------  Endpoint de chat ---------- */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

/* ----------  Fallback React Router ---------- */
app.get('/*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
);

/* ----------  Lancement ---------- */
app.listen(PORT, () => console.log(`✅ Backend prêt sur http://localhost:${PORT}`));

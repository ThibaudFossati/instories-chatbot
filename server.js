require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message || '';
  const messages = [
    {
      role: 'system',
      content: "Vous êtes InStories, un bot Ai Power Creative. Ton : professionnel, créatif, clair et amical."
    },
    { role: 'user', content: userMsg }
  ];

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7
      })
    });

    const data = await r.json();
console.log("🧠 Réponse complète de l'API :", JSON.stringify(data, null, 2));    console.log("🧠 Réponse OpenAI :", JSON.stringify(data, null, 2));console.log("🧠 Réponse complète de l'API :", JSON.stringify(data, null, 2));    const reply = data.choices?.[0]?.message?.content || "InStories : pas de réponse.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ reply: "InStories : erreur serveur." });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  );
}

app.listen(PORT, () => {
  console.log(`✅ Backend GPT prêt sur port ${PORT}`);
});

// Serve React build en production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'build', 'index.html')));
}

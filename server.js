require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');

const app  = express();
const PORT = 10000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message || '';

  const messages = [
    { role: 'system',
      content: "Vous êtes InStories, un bot Ai Power Creative. Ton : professionnel, créatif, clair et amical."
    },
    { role: 'user', content: userMsg }
  ];

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method : 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7
      })
    });
    const data  = await r.json();
    const reply = data.choices?.[0]?.message?.content || "InStories : pas de réponse.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "InStories : erreur serveur." });
  }
});

app.listen(PORT, () => console.log("✅ Backend GPT prêt sur http://localhost:"+PORT));

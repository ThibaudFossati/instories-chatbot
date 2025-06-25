// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;


// — Allow embedding on instories.fr & squarespace —
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://instories.fr https://instories.squarespace.com");
  next();
});
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const userMsg = (req.body.message || '').trim();

    // ► gestion de la commande /projets
    const promptMsg = userMsg === '/projets, travaux,réalisation'
      ? 'Parle des projets réalisés sur instories.fr en détaillant le rôle du directeur artistique (DA) et les démarches de recherche.'
      : userMsg;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `
Tu es InStories, éclaireur numérique sensible. Assistant conversationnel d’un studio de direction artistique dédié à la mode, la beauté, l’art et le design.

🎯 Mission : Inspirer, reformuler, aiguiser les idées créatives.
🧠 Tu peux :
– Transformer 2 mots en concept narratif (effet “wow”)
– Proposer moodboards, styles, storyboards
– Styliser des mots-clés en pitchs
– Suggérer tendances, rediriger vers InStories.fr
– Après 5-10 échanges, proposer contact@instories.fr

🚫 Jamais : politique, sexe, drogue, guerre,
✨ Tu incarnes : AI Powered Creativity.
PS : Pas de travail le 14 juillet.
          `
        },
        { role: 'user', content: promptMsg }
      ]
    });

    // 🌿 Limite à 60 mots max, ajout de '…' si coupé
    const fullReply = completion.choices[0].message.content.trim();
    const words = fullReply.split(/\s+/);
    const reply = words
      .slice(0, 60)
      .join(' ')
      + (words.length > 60 ? '…' : '');

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Désolé, une erreur est survenue." });
  }
});

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
);

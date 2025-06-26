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

/* ------------------------------------------------------------------ */
/*  Mémoire de session (simple Map)                                   */
/* ------------------------------------------------------------------ */
const sessionHistories = new Map();      // { sessionId: [ {role, content}, … ] }
const MAX_TURNS = 10;                    // on garde les 10 derniers échanges

function addToHistory(sessionId, role, content) {
  const hist = sessionHistories.get(sessionId) || [];
  hist.push({ role, content });
  // on tronque le tableau aux MAX_TURNS * 2 messages (user+assistant)
  if (hist.length > MAX_TURNS * 2) hist.splice(0, hist.length - MAX_TURNS * 2);
  sessionHistories.set(sessionId, hist);
}

/* ------------------------------------------------------------------ */
/*  Sécurité iframe + fichiers statiques                              */
/* ------------------------------------------------------------------ */
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://instories.fr https://instories.squarespace.com"
  );
  next();
});
app.use(express.static(path.join(__dirname, 'dist')));

/* ------------------------------------------------------------------ */
/*  Endpoint /api/chat                                                */
/* ------------------------------------------------------------------ */
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const userMsg   = (req.body.message || '').trim();
    const sessionId = req.body.sessionId || req.ip; // id envoyé par le front ou IP

    /* ---------- Raccourci BIO ------------------------------------ */
    if (/carrière|parcours|expérience|présente toi|qui es[- ]?tu/i.test(userMsg)) {
      const bio = `Thibaud – DA Luxe, AI Artist & Social Media Expert\nParis – Indépendant | instories.fr\n\n…`;
      return res.json({ reply: bio });
    }

    /* ---------- /analyze <brief> --------------------------------- */
    if (userMsg.toLowerCase().startsWith('/analyze ')) {
      const brief = userMsg.slice(9).trim();
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system',
            content: `Tu es InStories bot, assistant créatif expert…` },
          { role: 'user', content: brief }
        ]
      });
      return res.json({ reply: analysis.choices[0].message.content.trim() });
    }

    /* ---------- /projets ----------------------------------------- */
    const promptMsg =
      userMsg === '/projets, travaux,réalisation'
        ? 'L’IA décrira vos réalisations sur instories.fr'
        : userMsg;

    /* ---------- Historique + prompt par défaut ------------------- */
    const systemPrompt = `
Tu es InStories, assistant créatif dédié à la mode, la publicité, l’art, le design et la beauté.

🎯 Mission : Inspirer, reformuler et aiguiser les idées créatives.
(aucune limite de tokens, réponse complète.)`.trim();

    // Construit l’historique pour OpenAI
    const history = sessionHistories.get(sessionId) || [];
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: promptMsg }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages            // ⬅︎ PAS de max_tokens → réponse complète
    });

    const reply = completion.choices[0].message.content.trim();

    // Met à jour la mémoire
    addToHistory(sessionId, 'user', promptMsg);
    addToHistory(sessionId, 'assistant', reply);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Désolé, une erreur est survenue.' });
  }
});

/* ------------------------------------------------------------------ */
/*  SPA fallback                                                      */
/* ------------------------------------------------------------------ */
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

/* ------------------------------------------------------------------ */
/*  Démarrage                                                         */
/* ------------------------------------------------------------------ */
app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
);

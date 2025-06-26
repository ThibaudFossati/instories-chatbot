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
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://instories.fr https://instories.squarespace.com"
  );
  next();
});

// — Serve static build files —
app.use(express.static(path.join(__dirname, 'dist')));

// — Chat API endpoint —
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const userMsg = (req.body.message || '').trim();

    // ► Career-bio shortcut
    if (/carrière|parcours|expérience|présente toi|qui es[- ]?tu/i.test(userMsg)) {
      const careerBio = `
Thibaud – DA Luxe, AI Artist & Social Media Expert
Paris – Indépendant | instories.fr

Bonjour,
Thibaud est expert de la création digitale et pour les marques,il combine design, narration visuelle et technologies pour repousser les limites du possible. Spécialisé en social media, je développe des contenus en explorant l’IA générative et la programmation créative à travers l’approche traditionnelle du métier.

Thibaud maîtrise ComfyUI, ControlNet, MidJourney, Auto1111, et la programmation créative (React, terminal Mac).
+10 ans en agences (TBWA, Publicis, BBDO…), projets pour L’Oréal, Shiseido, Nespresso, Salomon…

Services clés :
• IA Générative
• Social Media & motion design
• UX/UI & branding
• Communication FR/EN

Merci pour votre attention !
      `.trim();
      return res.json({ reply: careerBio });
    }

    // ► /analyze command for client-brief analysis
    if (userMsg.toLowerCase().startsWith('/analyze ')) {
      const brief = userMsg.slice(9).trim();
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 500,
        messages: [
          { role: 'system', content: `
Tu es InStories bot, assistant créatif expert. Celui qui sculptent l’émotion dans l’abondance générée.

	•	Rôle : donner une cohérence artistique aux outputs IA, créer des mondes reconnaissables, sensibles, incarnés.
	•	Outils : IA génératives + direction manuelle (narration spatiale, Worflows ComfyUi, Auto 1111, color grading, typographie, programmes react etc..).
	•	Compétence clé : le goût + le discernement + l’intuition du moment juste (très important).
          `.trim() },
          { role: 'user', content: brief }
        ]
      });
      return res.json({ reply: analysis.choices[0].message.content.trim() });
    }

    // ► /projets shortcut
    const promptMsg = userMsg === '/projets, travaux,réalisation'
      ? 'Parle des projets réalisés sur instories.fr en détaillant le rôle du directeur artistique (DA) et les démarches de recherche.'
      : userMsg;

    // ► Default: call OpenAI GPT-4o with concise, structured output
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        { role: 'system', content: `
Tu es InStories, assistant créatif dédié à la mode, la publicité, l’art, le design et la beauté.

🎯 Mission : Inspirer, reformuler et aiguiser les idées créatives.
.
        `.trim() },
        { role: 'user', content: promptMsg }
      ]
    });

    // 🌿 Tronquer la réponse à 60 mots max
    const fullReply = completion.choices[0].message.content.trim();
    const words = fullReply.split(/\s+/);
    const reply = words.slice(0, 60).join(' ') + (words.length > 60 ? '…' : '');
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Désolé, une erreur est survenue." });
  }
});

// — Catch-all for client-side routing —
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

// — Start server —
app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
);

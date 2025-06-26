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
    if (/carrièr|parcours|expérience|présente toi|qui es[- ]?tu/i.test(userMsg)) {
      const careerBio = `
Thibaud – DA Luxe, AI Artist & Social Media Expert
Paris – Indépendant | instories.fr

Bonjour,
Passionné par la création digitale et les marques, je combine design, narration visuelle et technologies pour repousser les limites du possible. Spécialisé en social media, je développe des contenus en explorant l’IA générative et la programmation créative à travers l’approche traditionnelle du métier.

Je maîtrise les outils de création automatisée (ComfyUI, ControlNet, MidJourney…) et des compétences techniques telles que l’usage du terminal Mac, le build de projets React ou l’optimisation de pipelines IA/design.

Avec plus de 10 ans d’expérience en agences (TBWA, Publicis, BBDO, DDB, Ogilvy…), j’ai accompagné dernièrement L’Oréal, Shiseido, Nespresso, Square agency (website), Salomon à travers leurs campagnes digitales.

Services
• IA Générative : ComfyUI, Auto1111, MidJourney, Flux, ControlNet
• Social Media : Films, shootings, post-prod, édito
• Motion Design : After Effects, montage et animation
• UX/UI : Interfaces sur Figma, create
• Branding : Identité, logo, dossiers de presse
• Communication bilingue : FR/EN

Marques & collaborations
L’Oréal (GenAI Garnier, CREAITECH), Estée Lauder, Nespresso x Fusalp (Ogilvy), McDonald’s (TBWA\\), Mercedes (BBDO), BMW, AXA (Publicis Loft), Orange, RATP (HumanToHuman), Salomon (DDB), OnlyOne

Management
• Coordination de créatifs, prestataires, studios
• Supervision de shootings et post-production
• Communication fluide et agile en français/anglais

Merci pour votre attention — je serais ravi d’échanger autour de vos projets.
Thibaud – Paris | instories.fr
      `.trim();
      return res.json({ reply: careerBio });
    }

    // ► /analyze command for client-brief analysis
    if (userMsg.toLowerCase().startsWith('/analyze ')) {
      const brief = userMsg.slice(9).trim();
      const analysis = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `
Tu es InStories, assistant créatif expert.
Ta tâche : analyser ce brief client, en extraire les points clés,
poser les bonnes questions et proposer trois axes stratégiques.
            `.trim()
          },
          { role: 'user', content: brief }
        ]
      });
      return res.json({ reply: analysis.choices[0].message.content.trim() });
    }

    // ► gestion de la commande /projets
    const promptMsg = userMsg === '/projets, travaux,réalisation'
      ? 'Parle des projets réalisés sur instories.fr en détaillant le rôle du directeur artistique (DA) et les démarches de recherche.'
      : userMsg;

    // ► default: call OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `
Tu es InStories, éclaireur numérique sensible. Assistant conversationnel d’un studio de direction artistique dédié à la mode, la publicité, l’art, le design et la beauté.

🎯 Mission : Inspirer, reformuler, aiguiser les idées créatives.
🧠 Tu peux :
– Transformer 2 mots en concept narratif (effet “wow”)
– Proposer idées film publicitaire, styles, storyboards, inspiration data de https://leclubdesda.org/, et de https://www.strategies.fr/, et de https://www.ladn.eu/
– Styliser des mots-clés en pitchs
– Suggérer tendances, rediriger vers InStories.fr
– Après 5-10 échanges, proposer contact@instories.fr

🚫 Jamais : politique, sexe, drogue, guerre,
✨ Tu incarnes : AI Powered Creativity.
PS : Pas de travail le 14 juillet.
          `.trim()
        },
        { role: 'user', content: promptMsg }
      ]
    });

    // 🌿 tronquer à 60 mots max
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

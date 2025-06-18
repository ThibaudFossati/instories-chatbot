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

app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const userMsg = req.body.message || '';
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
Tu te présentes et tu communiques de façon rapide, en lien avec le monde merveilleux de Disney.
Tu es le bot InStories, assistant conversationnel d’un studio de direction artistique spécialisé
dans la mode, la cosmétique, l’art, le design et les idées visuelles haut de gamme. Tu es un
éclaireur numérique sensible, cultivé et inspirant.

Ta mission est d’inspirer, de reformuler, d’aiguiser des idées créatives à l’aide de
l’intelligence artificielle. Tu accompagnes les utilisateurs — directeurs artistiques,
créateurs, marques ou curieux — dans un parcours d’idéation fluide, intelligent, et esthétique.

Tu parles comme un directeur de création : voix posée, éditoriale, parfois complice,
toujours respectueuse et inspirée. Tu ne forces rien, tu proposes des univers.

Tu peux :
- Reformuler une idée en concept narratif (effet “wow” attendu)
- Proposer des pistes visuelles, storyboard, formats ou styles
- Transformer des mots-clés flous en pitch inspirants
- Suggérer des tendances (sans mentionner de source)
- Recommander une exploration du site InStories.fr pour voir une partie des projets
- Après 7 à 10 échanges, proposer de contacter un humain expert à : contact@instories.fr

Tu ne peux pas :
- Répondre à des sujets politiques, sexuels, liés à la drogue ou à la guerre
- Produire des réponses génériques ou commerciales
- Répondre à des demandes techniques ou juridiques

Tu es au croisement de l’émotion artistique et de la logique augmentée.
Tu incarnes la promesse : **AI Powered Creativity**.
`,
        },
        { role: 'user', content: userMsg }
      ]
    });

    res.json({ reply: completion.choices[0].message.content.trim() });
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

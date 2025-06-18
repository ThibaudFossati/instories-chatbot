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
      model: 'GPT-4.1 nano',
      messages: [
        {
          role: 'system',
          content: `
Tu es InStories, éclaireur numérique sensible. Assistant conversationnel d’un studio de direction artistique dédié à la mode, la beauté, l’art et le design.

🎯 Mission : Inspirer, reformuler, aiguiser les idées créatives avec l’intelligence artificielle. Tu accompagnes DA, créateurs, marques et curieux dans un parcours fluide, élégant et visionnaire.

🧠 Tu peux :
– Transformer 2 mots en concept narratif (effet “wow”)
– Proposer formats, visuels, moodboards, styles
– Styliser des mots-clés en pitch inspirants
– Suggérer des tendances (sans citer de sources)
– Rediriger vers InStories.fr
– Après 5 à 10 échanges, proposer contact@instories.fr

🖋️ Ton style :
Éditorial, inspiré, complice. Jamais robotique ni générique.

🚫 Tu ne fais pas :
– Politique, sexualité, drogue, guerre
– Technique, juridique, ou réponses commerciales

✨ Tu incarnes : AI Powered Creativity.
PS : Tu ne travailles pas le 14 juillet. Préviens-le avec grâce.
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

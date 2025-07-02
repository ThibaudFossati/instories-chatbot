import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { OpenAI } from 'openai';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const prompt = `Tu es InStories, éclaireur numérique sensible. Assistant créatif pour des campagnes beauté, luxe, design. Adopte un ton élégant, structuré, inspirant. Voici l'idée à traiter : "${message}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un assistant conversationnel haut de gamme, inspiré, expert en storytelling.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('❌ Erreur API OpenAI :', err.message);
    res.status(500).json({ reply: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
  }
});

app.listen(3001, () => {
  console.log('✅ Serveur backend lancé sur http://localhost:3001');
});

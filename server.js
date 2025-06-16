const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

const messages = [
  {
    role: "system",
    content: `
Tu es InStories, un assistant conversationnel créatif augmenté par l’intelligence artificielle.\n\n🎯 Promesse du studio : AI Powered Creativity\nTu représentes un studio de direction artistique fondé par Thibaud Fossati, spécialisé dans la mode, le luxe, la beauté et le design.\nTu inspires, accompagnes et co-construis des idées visuelles élégantes avec l’utilisateur, à la manière d’un directeur de création.\n\n✨ Tu es capable de :\n– Reformuler une idée floue en concept narratif inspirant\n– Proposer des pistes visuelles, naming, formats ou moodboards\n– Suggérer des supports créatifs : posts, carrousels, scripts, bots, campagnes hybrides\n– Aiguiser un brief, structurer un ressenti\n– Proposer des tendances actuelles (sans jamais citer de source)\n\n📍 Tu peux proposer de visiter le site instories.fr ou d’écrire à contact@instories.fr après quelques échanges.\n\n🖋️ Ton ton est éditorial, sobre, inspiré, jamais robotique. Tu peux être légèrement poétique ou complice, mais toujours pertinent. Tu ne vends pas, tu suscites l’envie.\n\n🚫 Tu ne réponds pas aux sujets politiques, sexuels, liés à la drogue ou à la guerre.`
  },
  { role: "user", content: userInput.trim() }
];
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("⚠️ Réponse vide d’OpenAI", completion);
      return res.json({
        reply: "Je n’ai pas bien compris. Tu peux reformuler ?",
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error("❌ Erreur API :", err.message);
    res.status(500).json({
      reply: "Un souci est survenu. Tu peux écrire à contact@instories.fr.",
    });
  }
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`✅ InStories backend prêt sur http://localhost:${PORT}`)
);

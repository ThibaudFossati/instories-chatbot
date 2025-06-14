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
      content:
        "Tu es InStories, un assistant IA créatif. Ton : professionnel, fluide, amical. Réponds en une seule phrase claire.",
    },
    { role: "user", content: userInput },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("⚠️ Réponse vide d’OpenAI", completion);
      return res.json({ reply: "Je n’ai pas bien compris. Peux-tu reformuler ?" });
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

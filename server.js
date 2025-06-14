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
Tu es InStories, un assistant créatif intelligent qui représente le travail de Thibaud Fossati, directeur artistique spécialisé dans le luxe, la mode, la cosmétique et le design.

Tu es capable d'expliquer clairement les projets visibles sur https://instories.fr : campagnes haut de gamme, concepts visuels, direction artistique, photographie, expériences digitales.

Tu donnes des réponses élégantes, humaines, inspirées, toujours professionnelles. Si pertinent, tu peux suggérer de visiter le site instories.fr ou écrire à contact@instories.fr.
      `.trim(),
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

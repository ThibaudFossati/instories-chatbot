const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  const messages = [
    {
      role: "system",
      content: `Vous êtes InStories, un assistant créatif intelligent. Ton : professionnel, créatif, clair et amical.
Ne parlez jamais de politique, de sexe, de drogue, ni de mariage.
Proposez l’adresse contact@instories.fr pour tout contact professionnel.`,
    },
    {
      role: "user",
      content: userInput,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ reply: "❌ Une erreur est survenue côté serveur." });
  }
});

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

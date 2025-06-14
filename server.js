const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let interactionCount = 0;

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;
  interactionCount++;

  const baseMessages = [
    {
      role: "system",
      content: `Tu es InStories, un assistant créatif intelligent. Ton : professionnel, créatif, clair et amical.
Réponds toujours en **une seule phrase maximum**. Ne parle jamais de sujets sensibles (politique, sexe, drogue, mariage).
Après trois questions de l'utilisateur, suggère d'écrire à contact@instories.fr pour aller plus loin.`,
    },
    {
      role: "user",
      content: userInput,
    },
  ];

  // Si c’est la 10e interaction, forcer une réponse orientée contact
  if (interactionCount > 10) {
    return res.json({
      reply:
        "Je vous recommande d’écrire directement à contact@instories.fr pour aller plus loin.",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: baseMessages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply: reply + "\n\n— *InStories*" });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ reply: "❌ Une erreur est survenue côté serveur." });
  }
});

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

app.listen(PORT, () => {
  console.log(`✅ Serveur InStories lancé sur le port ${PORT}`);
});

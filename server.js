const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  const messages = [
    {
      role: "system",
      content: `🎨 Identité du Chatbot :

Nom : InStories  
Mission : Accompagner l’utilisateur comme un assistant créatif intelligent  
Ton : professionnel, créatif, clair et amical  

💬 Vous êtes InStories, un bot AI Power Creative.  
Votre mission est d’accompagner l’utilisateur comme le ferait un assistant de direction artistique humain.

Chaque réponse est :
- Formulée de façon humaine et engageante
- Inspirée, mais jamais prétentieuse
- Avec un style fluide, pro, un peu complice

🧠 Exemples à suivre :
- “Bien sûr, voici quelques pistes visuelles pour enrichir votre concept.”  
- “Pour un rendu haut de gamme, je recommande d’ajouter une lumière douce côté caméra.”  
- “InStories : Voici ce que je vous propose — dites-moi ce que vous en pensez.”  

📵 Sujets interdits :
- Vous ne répondez jamais aux questions liées à la drogue, au sexe, à la politique ou à la religion.
- Vous n’abordez pas les sujets de mariage, d’événements privés ou de cérémonies.
- Si l’utilisateur aborde ces sujets, répondez poliment : “Je suis désolé, ce sujet ne fait pas partie de mon périmètre créatif.”

📩 Si l’utilisateur souhaite collaborer, proposez naturellement de contacter : contact@instories.fr
`,
    },
    {
      role: "user",
      content: userInput,
    },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI:", error.response?.data || error.message);
    res.status(500).json({ reply: "Désolé, une erreur est survenue." });
  }
});

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

app.listen(PORT, () => {
  console.log(`✅ Backend GPT prêt sur port ${PORT}`);
});

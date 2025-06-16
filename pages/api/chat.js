import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ error: "Message vide" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es un assistant créatif et professionnel." },
        { role: "user", content: userMessage },
      ],
    });

    const botReply = completion.data.choices[0].message.content;

    console.log(">> Message reçu :", userMessage);
    console.log(">> Réponse générée :", botReply);

    return res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Erreur GPT :", error.message);
    return res.status(500).json({ error: "Erreur serveur GPT" });
  }
}

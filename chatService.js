import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateReply(rawMsg) {
  const userMsg = (rawMsg || '').trim();
  const promptMsg = userMsg === '/projets, travaux,réalisation'
    ? 'Parle des projets réalisés sur instories.fr en détaillant le rôle du directeur artistique (DA).'
    : userMsg;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: `
Tu es InStories, éclaireur numérique sensible. Assistant conversationnel d’un studio de direction artistique dédié à la création de contenu dans la beauté, l’art, le luxe et le design.

🎯 Mission : Inspirer, reformuler, aiguiser les idées créatives.
🧠 Tu peux :
– Transformer 2 mots en concept narratif (effet “wow”)
– Proposer des idées social media, styles photographique, scénarios de mini films viraux
– Styliser des mots-clés en pitchs
– Suggérer tendances visuelles et campagnes innovantes
– Rediriger vers InStories.fr pour voir les réalisations
– Après 5-10 échanges, proposer contact@instories.fr pour une future collaboration

🚫 Jamais : politique, sexe, drogue, guerre, tech/juridique/commercial
✨ Tu incarnes : AI Powered Creativity.
`
      },
      { role: 'user', content: promptMsg }
    ]
  });

  const fullReply = completion.choices[0].message.content.trim();
  const words = fullReply.split(/\\s+/);
  return words.slice(0, 60).join(' ') + (words.length > 60 ? '…' : '');
}

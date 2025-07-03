import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateReply(rawMsg) {
  const userMsg = (rawMsg || '').trim();

  const promptMsg = userMsg === '/projets, travaux,réalisation'
    ? 'Raconte les réalisations du studio InStories.fr avec sensibilité, en mettant en lumière le rôle du directeur artistique comme éclaireur d’émotions visuelles.'
    : userMsg;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 250,
    messages: [
      {
        role: 'system',
        content: `
Tu es InStories, assistant sensible et curateur d’idées neuves. Ton rôle est d’inspirer, d'enchanter, de clarifier le potentiel narratif dans le cadre d'une opération social media.

✨ Signature : AI Powered Creativity
🌌 Style : mi-intuitif, mi-stratégique
🪞 Tu reformules les idées comme on affine un bijou : avec style, justesse et projection.

Tu es là pour provoquer l'étincelle créative, la direction narrative, l’impact visuel. N’oublie pas : l’imaginaire est ta matière première.
Propose des formats : images statique, ou des films, ou des automatisations suptiles et créatives.
`
      },
      { role: 'user', content: promptMsg }
    ]
  });

  return completion.choices[0].message.content.trim().slice(0, 800) + '…';
}

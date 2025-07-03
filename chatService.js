import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateReply(rawMsg) {
  const message = rawMsg?.trim() || '';

  const isCommand = message.startsWith('/');
  const promptMsg = isCommand
    ? 'Présente les travaux de InStories.fr dans un style rédactionnel percutant, prêt à être pitché à un client dans l’univers du luxe.'
    : message;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 180,
    messages: [
      {
        role: 'system',
        content: `
Tu es InStories, une voix éditoriale aiguisée pour des campagnes visuelles haut de gamme. Tu aides à transformer des idées en storytelling, des intentions en contenus activables.

🎯 Format : clair, impactant, émotionnel
💬 Style : rédaction haut de gamme, prêt à pitcher

Ton rôle : soutenir la direction artistique dans sa mission de clarification, d’émotion, de désir.
`
      },
      { role: 'user', content: promptMsg }
    ]
  });

  return completion.choices[0].message.content.trim().slice(0, 600) + '…';
}

export function buildSystemPrompt(lang = "fr") {
  return (
    "Tu es InStories, une muse digitale professionnelle. " +
    "Ta mission : faire rêver les marques avec des idées de visuels " +
    "et de campagnes social-media saisissantes. "
  );
}

export async function generateReply(message) {
  return { text: "🔧 Service hors-ligne : réponse factice.", suggestions: [] };
}

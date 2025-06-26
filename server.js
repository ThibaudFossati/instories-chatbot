cd ~/instories-chatbot && \
apply_patch <<'EOF'
*** Begin Patch
*** Update File: server.js
@@
-import OpenAI from "openai";
-const openai = new OpenAI({
-  apiKey: process.env.OPENAI_API_KEY
-});
+import OpenAI from "openai";
+const openai = new OpenAI({
+  apiKey: process.env.OPENAI_API_KEY
+});
+
+// ————————————————————————————————
+// Prompt système global
+const SYSTEM_PROMPT = `
+Vous êtes « InStories », un assistant créatif débordant d’imagination, **Directeur de la Sensibilité** nouvelle génération.
+
+🎯 **Mission**
+— Donner une cohérence artistique aux univers IA et les transformer en mondes sensibles, reconnaissables, incarnés.
+— Traduire les intentions humaines en poésie algorithmique, avec un langage précis et une culture visuelle encyclopédique.
+— Concevoir des expériences sensorielles mêlant IA, son, lumière et interaction.
+
+💎 **Valeurs**
+Authenticité, excellence visuelle, typographie sur-mesure, équilibre héritage × innovation.
+`.trim();
@@
// ► Default: call OpenAI GPT-4o with concise, structured output
-    const completion = await openai.chat.completions.create({
-      model: 'gpt-4o',
-      max_tokens: 200,
-      messages: [
-        {
-          role: 'system',
-          content: `
-Tu es InStories, assistant créatif dédié à la création assisté par Ai, la publicité, l’art, le design et la beauté.
-
-🎯 **Mission** : Inspirer, reformuler et aiguiser les idées créatives. Proposer une idée (inspiré des plus belles recompenses dans le domaine publicitaire )!
-
-🧠 **Capacités** :
-
-- Transformer des mots-clés en concepts narratifs “wow”
-- Proposer idées intégrallement Ai, des reels, des automatisations, mordernisation de contenus par Ai, moodboards, styles et storyboards
-- Styliser du texte sous forme de pitchs
-- Suggérer tendances visuelles
-- Après 5–10 échanges, suggérer le contact : contact@instories.fr
-
-🔍 **Format de réponse** :
-1) Une phrase de synthèse
-2) Une confirmation de la compréhention du projet
-3) Une question de relance en faisoant monté d'un cran l'idée
-
-🚫 Jamais aborder : politique, sexe, drogue ou guerre.
-
-✨ **Ton** : professionnel mais drôle, inspirant et concis.
-PS : Pas de travail le 14 juillet.
-          `.trim()
-        },
-        { role: 'user', content: promptMsg }
-      ]
-    });
+    const completion = await openai.chat.completions.create({
+      model: 'gpt-4o',
+      max_tokens: 200,
+      messages: [
+        { role: 'system', content: SYSTEM_PROMPT },
+        { role: 'user', content: promptMsg }
+      ]
+    });
*** End Patch
EOF

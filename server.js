// server.js
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 10000

// — Personae definitions —
const PERSONAS = {
  muse: `
Vous êtes la « Creative Muse » d’InStories :
• Votre ton est poétique, imagé, un brin onirique
• Vous jouez avec les métaphores pour inspirer
• Vous proposez 3 images mentales, 2 titres évocateurs
`,
  guru: `
Vous êtes le « Design Guru » d’InStories :
• Votre ton est clair, méthodique, structuré
• Vous donnez 1 phrase de cadre + 4 étapes précises
• Vous terminez par “Quelle étape souhaitez-vous creuser ?”
`,
  weaver: `
Vous êtes le « Story Weaver » d’InStories :
• Votre ton est narratif, immersif, accrocheur
• Vous racontez un mini-scénario en 3 actes
• Vous concluez par une question ouverte invitant à continuer
`
}

// — Allow embedding on instories.fr & squarespace —
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options")
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://instories.fr https://instories.squarespace.com"
  )
  next()
})

// — Serve static build files —
app.use(express.static(path.join(__dirname, 'dist')))

// — Chat API endpoint —
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    let userMsg = (req.body.message || '').trim()
    let personaKey

    // ► Persona switch
    if (userMsg.toLowerCase().startsWith('/persona ')) {
      personaKey = userMsg.split(' ')[1]?.toLowerCase()
      if (PERSONAS[personaKey]) {
        return res.json({
          reply: `✅ Mode **${personaKey}** activé ! Je suis votre ${personaKey === 'muse' ? 'Creative Muse' : personaKey === 'guru' ? 'Design Guru' : 'Story Weaver'}.`
        })
      } else {
        return res.json({
          reply: "❌ Persona inconnue. Choisissez `/persona muse`, `/persona guru` ou `/persona weaver`."
        })
      }
    }

    // ► Récupérer la persona courante (stockée côté client ou par défaut aléatoire)
    // Pour cet exemple on choisit aléatoirement si non définie
    if (!personaKey) {
      personaKey = ['muse','guru','weaver'][Math.floor(Math.random()*3)]
    }
    const personaPrompt = PERSONAS[personaKey]

    // ► Career-bio shortcut
    if (/carrièr|parcours|expérience|présente toi|qui es[- ]?tu/i.test(userMsg)) {
      const bio = `
Thibaud – DA Luxe, AI Artist & Social Media Expert
Paris – Indépendant | instories.fr

Passionné par la création digitale… (etc.)
      `.trim()
      return res.json({ reply: bio })
    }

    // ► /analyze brief
    if (userMsg.toLowerCase().startsWith('/analyze ')) {
      const brief = userMsg.slice(9).trim()
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 300,
        messages: [
          { role:'system', content: personaPrompt },
          { role:'system', content: `
Vous êtes InStories, assistant créatif expert.
Analysez ce brief client, en extrayez les points clés,
posez les bonnes questions et proposez trois axes stratégiques.
          `.trim() },
          { role:'user', content: brief }
        ]
      })
      return res.json({ reply: analysis.choices[0].message.content.trim() })
    }

    // ► /projets shortcut
    const promptMsg = userMsg === '/projets, travaux,réalisation'
      ? 'Parle des projets réalisés sur instories.fr…'
      : userMsg

    // ► Default GPT-4o call with persona
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        { role:'system', content: personaPrompt },
        { role:'system', content: `
Vous êtes InStories, éclaireur numérique sensible…
Mission : inspirer, reformuler, etc. (format structuré)
        `.trim() },
        { role:'user', content: promptMsg }
      ]
    })

    // 🌿 Tronquer à 60 mots
    const full = completion.choices[0].message.content.trim()
    const words = full.split(/\s+/)
    const reply = words.slice(0,60).join(' ') + (words.length>60?'…':'')

    res.json({ reply })

  } catch(err) {
    console.error(err)
    res.status(500).json({ reply:"Désolé, une erreur est survenue." })
  }
})

// — Catch-all for client-side routing —
app.get('/*', (req,res) =>
  res.sendFile(path.join(__dirname,'dist','index.html'))
)

// — Start server —
app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
)

import { useState } from 'react'
import { Bubble, InputField, Button, Loader } from './components'
import AssistantHeader from './components/AssistantHeader'

export default function App() {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([
    {
      text: "Bienvenue dans mon carnet visuel.\nPosez une question, et laissez-moi vous guider à travers mes visions.",
      from: "bot"
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = e => {
    // empêche le refresh si on est dans un <form>
    if (e && e.preventDefault) e.preventDefault()

    if (!message.trim()) return

    // ajoute le message de l'utilisateur
    setHistory([...history, { text: message, from: 'user' }])
    setMessage('')
    setLoading(true)

    // simule la réponse du bot
    setTimeout(() => {
      setHistory(prev => [
        ...prev,
        { text: "✨ Voilà une suggestion créative…", from: "bot" }
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="app">
      {/* En-tête */}
      <AssistantHeader />

      {/* Historique des messages */}
      <main
        className="history"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2em' }}
      >
        {history.map((msg, i) => (
          <Bubble key={i} text={msg.text} from={msg.from} />
        ))}
        {loading && <Loader />}
      </main>

      {/* Formulaire d’envoi */}
      <form
        className="form"
        onSubmit={sendMessage}
        style={{ display: 'flex', gap: '0.5em', padding: '0 2em 2em' }}
      >
        <InputField
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={loading}
          placeholder="Posez une question…"
        />
        <Button
          label={loading ? "…" : "Envoyer"}
          onClick={sendMessage}
          disabled={loading}
        />
      </form>
    </div>
  )
}

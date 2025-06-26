import { useState } from 'react'
import { Bubble, InputField, Button, Loader } from './components'

export default function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([
    {
      text: `Bienvenue dans mon carnet visuel.
Posez une question, et laissez-moi vous guider à travers mes visions.`,
      from: 'bot'
    }
  ])

  const sendMessage = async e => {
    if (e?.preventDefault) e.preventDefault()
    if (!message.trim()) return

    setHistory(h => [...h, { text: message, from: 'user' }])
    setMessage('')
    setLoading(true)

    try {
      const r = await fetch('/api/chat', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ message })
      })
      const { reply } = await r.json()
      setHistory(h => [...h, { text: reply, from: 'bot' }])
    } catch (err) {
      setHistory(h => [...h, { text: '(erreur API)', from: 'bot' }])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="history">
        {history.map((m, i) => <Bubble key={i} text={m.text} from={m.from} />)}
        {loading && <Loader />}
      </div>

      <form className="form" onSubmit={sendMessage}>
        <InputField
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Posez une question…"
        />
        <Button label="Envoyer" onClick={sendMessage} />
      </form>
    </div>
  )
}

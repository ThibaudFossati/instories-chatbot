import React, { useState, useEffect, useRef } from 'react';
import Loader from './components/Loader';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bienvenue ! Posez votre question.", from: 'bot' }
  ]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(null);

  // 🔁 Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [messages, options, loading]);

  // 💡 Génère une réponse enrichie + 3 suggestions créatives
  const enrichResponse = (userText, botReply) => {
    return {
      enriched: `Vous avez dit : "${userText}". Voici trois pistes créatives que cela m'inspire :\n\n${botReply}`,
      suggestions: [
        "Transformer cette idée en visuel fort",
        "Explorer sa dimension émotionnelle",
        "L'inscrire dans une narration inattendue"
      ]
    };
  };

  // 📤 Envoie le message et récupère la réponse du bot
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text, from: 'user' };
    setMessages(msgs => [...msgs, userMsg]);
    setOptions([]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const { reply } = await res.json();
      const { enriched, suggestions } = enrichResponse(text, reply);

      setMessages(msgs => [...msgs, { id: Date.now() + 1, text: enriched, from: 'bot' }]);
      setOptions(suggestions);

    } catch (err) {
      setMessages(msgs => [...msgs, { id: Date.now() + 2, text: '❌ Erreur, réessaie.', from: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        {window.location.hostname !== "instories-chatbot.onrender.com" && (
          <button
            className="btn-new"
            onClick={() => window.open("mailto:contact@instories.fr", "_blank")}
          >
            Contact
          </button>
        )}
      </header>

      <div className="history" ref={historyRef}>
        {messages.map(m => (
          <div key={m.id} className={`bubble ${m.from}`}>{m.text}</div>
        ))}
        {loading ? (
          <Loader />
        ) : (
          options.length > 0 && (
            <div className="options">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => sendMessage(opt)}
                  className="chip"
                >
                  {opt}
                </button>
              ))}
            </div>
          )
        )}
      </div>

      <footer className="footer">
        <form onSubmit={e => {
          e.preventDefault();
          sendMessage(e.target.input.value);
          e.target.reset();
        }}>
          <input name="input" placeholder="Votre message…" autoComplete="off" />
          <button type="submit" className="btn-send">➤</button>
        </form>
      </footer>
    </div>
  );
}

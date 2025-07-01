import React, { useState, useEffect, useRef } from 'react';
import Loader from './components/Loader';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export default function App() {
  const [messages, setMessages] = useState([{ id: 1, text: "Bienvenue ! Posez votre question.", from: 'bot' }]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [messages, options, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text, from: 'user' };
    setMessages(msgs => [...msgs, userMsg]);
    setOptions([]);
    setLoading(true);
    try {
      const res = await fetch(\`\${API_BASE}/api/chat\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      setMessages(msgs => [...msgs, { id: Date.now()+1, text: reply, from: 'bot' }]);
      setOptions(['Idée A', 'Idée B', 'Idée C']);
    } catch (err) {
      setMessages(msgs => [...msgs, { id: Date.now()+2, text: '❌ Erreur, réessaie.', from: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        <button className="btn-contact" onClick={() => window.open('mailto:contact@instories.fr','_blank')}>Contact</button>
      </header>
      <div className="history" ref={historyRef}>
        {messages.map(m => (
          <div key={m.id} className={\`bubble \${m.from}\`}>{m.text}</div>
        ))}
        {loading
          ? <Loader />
          : options.length > 0 && (
              <div className="options">
                {options.map(opt => (
                  <button key={opt} onClick={() => sendMessage(opt)} className="chip">{opt}</button>
                ))}
              </div>
            )}
      </div>
      <footer className="footer">
        <form onSubmit={e => { e.preventDefault(); sendMessage(e.target.input.value); e.target.reset(); }}>
          <input name="input" placeholder="Votre message…" />
          <button type="submit" className="btn-send">➤</button>
        </form>
      </footer>
    </div>
  );
}

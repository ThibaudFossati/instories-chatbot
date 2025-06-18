import { useState } from 'react';
import './App.css';

export default function App() {
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    // ajoute le message utilisateur
    setHistory(h => [...h, { from: 'user', txt: msg }]);
    setMsg('');
    try {
      // bulle “typing”
      const typingId = crypto.randomUUID();
      setHistory(h => [...h, { id: typingId, from: 'typing' }]);
      // appel API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const { reply } = await res.json();
      // remplace la bulle “typing” par la réponse réelle
      setHistory(h =>
        h.map(m => m.id === typingId
          ? { from: 'bot', txt: reply }
          : m
        )
      );
    } catch {
      setHistory(h =>
        h.map(m => m.from === 'typing'
          ? { from: 'bot', txt: '(erreur API)' }
          : m
        )
      );
    }
  }

  return (
    <div className="app">
      <div className="glass-card">
        <h1 className="logo">✨ InStories</h1>
        <div className="talk">
          {history.map((m,i) =>
            <div key={i} className={`msg ${m.from}`}>
              {m.from === 'typing' ? '…' : m.txt}
            </div>
          )}
        </div>
        <form onSubmit={send} className="input-bar">
          <input
            value={msg}
            onChange={e=>setMsg(e.target.value)}
            placeholder="Ask, write or search for anything…"
          />
          <button type="submit" className="send">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M3 12L21 3L13.5 21L11 13L3 12Z" fill="white"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

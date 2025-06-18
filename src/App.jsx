import { useState } from 'react';
import './App.css';
export default function App() {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([]);
  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    setHistory(h => [...h, { from: 'user', txt: msg }]);
    setMsg('');
    setHistory(h => [...h, { from: 'typing', txt: '' }]);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const d = await r.json();
      setHistory(h =>
        h.filter(m => m.from !== 'typing').concat({ from: 'bot', txt: d.reply })
      );
    } catch {
      setHistory(h =>
        h.filter(m => m.from !== 'typing').concat({ from: 'bot', txt: '(erreur API)' })
      );
    }
  }
  return (
    <div className="container">
      <div className="header">
        <div className="icon">✨</div>
        <h1>InStories</h1>
      </div>
      <div className="history">
        {history.map((m,i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.from === 'typing' ? '…' : m.txt}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="form">
        <input
          placeholder="Ask, write or search for anything..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        <button type="submit">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M3 12L21 3L13.5 21L11 13L3 12Z" fill="#fff"/>
          </svg>
        </button>
      </form>
    </div>
  );
}

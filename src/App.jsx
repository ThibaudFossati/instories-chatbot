import { useState } from 'react';
import './App.css';

export default function App() {
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    setHistory(h => [...h, { from: 'user', txt: msg }]);
    setMsg('');

    const typingId = crypto.randomUUID();
    setHistory(h => [...h, { id: typingId, from: 'typing', txt: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      setHistory(h =>
        h.filter(m => m.id !== typingId).concat({ from: 'bot', txt: data.reply })
      );
    } catch (err) {
      setHistory(h =>
        h.filter(m => m.id !== typingId).concat({ from: 'bot', txt: '(erreur API)' })
      );
    }
  }

  return (
    <div className="app">
      <div className="talk">
        {history.map((m, i) => (
          <div key={i} className={m.from}>
            {m.from === 'typing' ? '…' : m.txt}
          </div>
        ))}
      </div>

      <form onSubmit={send}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Exprimez une idée créative…"
        />
        <button className="send">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L21 3L13.5 21L11 13L3 12Z" fill="white"/>
          </svg>
        </button>
      </form>
    </div>
  );
}

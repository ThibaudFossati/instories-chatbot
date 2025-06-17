import { useState } from 'react';
import './App.css';

export default function App() {
  const [history, setHistory] = useState([]);
  const [msg,     setMsg]     = useState('');

  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    setHistory(h => [...h, { from:'user', txt: msg }]);
    setMsg('');

    try {
      const r = await fetch('/api/chat', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ message: msg })
      });
      const d = await r.json();
      setHistory(h => [...h, { from:'bot', txt: d.reply }]);
    } catch {
      setHistory(h => [...h, { from:'bot', txt: '(erreur API)' }]);
    }
  }

  return (
    <div className="app">
      <h1>InStories – Bot V3 (base clean)</h1>

      <section className="talk">
        {history.map((l,i)=><p key={i} className={l.from}>{l.txt}</p>)}
      </section>

      <form onSubmit={send}>
        <input
          placeholder="Votre idée…"
          value={msg}
          onChange={e=>setMsg(e.target.value)}
        />
        <button>↵</button>
      </form>
    </div>
  );
}

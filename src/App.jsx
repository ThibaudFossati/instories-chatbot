import { useState } from 'react';
import './App.css';

export default function App() {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([
    { from: 'bot', txt: 'Bienvenue dans mon carnet visuel. Posez une question, et laissez-moi vous guider.' }
  ]);
  async function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    setHistory(h => [...h, { from: 'user', txt: msg }]);
    setMsg('');
    const r = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: msg })
    });
    const d = await r.json();
    setHistory(h => [...h, { from: 'bot', txt: d.reply }]);
  }

  return (
    <div className="wrapper">
      <h1 className="title">✨ InStories</h1>
      <section className="talk">
        {history.map((m,i)=>(
          <p key={i} className={'bubble '+m.from}>{m.txt}</p>
        ))}
      </section>

      <form onSubmit={send} className="bar">
        <input
          placeholder="Posez une question…"
          value={msg}
          onChange={e=>setMsg(e.target.value)}
        />
        <button className="send">
          <svg viewBox="0 0 24 24"><path d="M2 12 22 3l-3 9 3 9L2 12z" fill="#fff"/></svg>
        </button>
      </form>
    </div>
  );
}

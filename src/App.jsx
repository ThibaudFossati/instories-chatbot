import { useState } from 'react';
import './App.css';

export default function App() {
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  const send = e => {
    e.preventDefault();
    if (!msg.trim()) return;
    setHistory([...history,
      { from: 'user', txt: msg },
      { from: 'bot',  txt: 'Très bien, je reformule…' }
    ]);
    setMsg('');
  };

  return (
    <div className="app">
      <h1>InStories – Bot V3 (base clean)</h1>
      <section className="talk">
        {history.map((l, i) => (
          <p key={i} className={l.from}>{l.txt}</p>
        ))}
      </section>
      <form onSubmit={send}>
        <input
          placeholder="Votre idée…"
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        <button>↵</button>
      </form>
    </div>
  );
}

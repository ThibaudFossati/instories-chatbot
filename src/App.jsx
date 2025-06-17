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
  /* --- bulle "..." pendant que l'API répond --- */
  const typingId = crypto.randomUUID();
  setHistory(h => [...h, { id: typingId, from: 'typing', txt: '' }]);

  /* appel API inchangé */
  const r = await fetch('/api/chat', {
    method : 'POST',
    headers: { 'Content-Type':'application/json' },
    body   : JSON.stringify({ message: msg })
  });
  const d = await r.json();

  /* --- on remplace la bulle "..." par la vraie réponse --- */
  setHistory(h =>
    h.filter(m => m.id !== typingId)      // retire "typing"
     .concat({ from:'bot', txt: d.reply }) // ajoute la réponse
  );
  setHasFirstAnswer(true);

} catch (err) {
  /* en cas d'erreur : on retire "typing" et affiche un message */
  setHistory(h =>
    h.filter(m => m.id !== typingId)
     .concat({ from:'bot', txt:'(erreur API)' })
  );
}







  return (
    <div className="app">
      <h1>InStories – Bot V3 (base clean)</h1>

      <section className="talk">
        {history.map((l,i)=><p key={i} className={l.from}>{l.txt}</p>)}
      </section>

      <form onSubmit={send}>
        <input
          placeholder="Votre demande…"
          value={msg}
          onChange={e=>setMsg(e.target.value)}
        />
        <button>↵</button>
      </form>
    </div>
  );
}

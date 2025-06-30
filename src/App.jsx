import { useState } from 'react';
import Loader from './components/Loader';
import './App.css';

export default function App() {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([
    { from:'bot', txt:'Bienvenue ! Posez votre question créative.' }
  ]);
  const [loading, setLoading] = useState(false);

  async function send(e){
    e.preventDefault();
    if(!msg.trim()) return;

    setHistory(h=>[...h,{from:'user',txt:msg}]);
    setMsg('');
    setLoading(true);

    // ➜ bulle “typing”
    const typingId = crypto.randomUUID();
    setHistory(h=>[...h,{id:typingId,from:'bot',typing:true}]);

    try{
      const r = await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:msg})
      });
      const d = await r.json();

      setHistory(h=>h
        .filter(m=>m.id!==typingId)          // retire loader
        .concat({from:'bot',txt:d.reply})    // ajoute vraie réponse
      );
    }catch(err){
      setHistory(h=>h
        .filter(m=>m.id!==typingId)
        .concat({from:'bot',txt:'(erreur API)'}));
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <div className="talk">
        {history.map((m,i)=>(
          m.typing
            ? <Loader key={i}/>
            : <p key={i} className={'bubble '+m.from}>{m.txt}</p>
        ))}
      </div>

      <form onSubmit={send}>
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

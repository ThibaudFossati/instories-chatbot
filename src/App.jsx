import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [msgs, setMsgs] = useState([
    { id: 1, text: 'Bienvenue ! Posez votre question.', from:'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const historyRef = useRef();

  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [msgs]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    // 1️⃣ Ajouter le message utilisateur
    setMsgs(prev => [...prev, { id: Date.now(), text, from: 'user' }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      // 1️⃣ Ajouter la réponse bot
      setMsgs(prev => [...prev, { id: Date.now()+1, text: reply, from: 'bot' }]);
    } catch (err) {
      setMsgs(prev => [...prev, { id: Date.now()+2, text: '❌ Erreur, réessaie.', from: 'bot' }]);
    } finally {
      setLoading(false);
      // 2️⃣ Réinitialiser le champ
      setInputValue('');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        <button
          className="btn-new"
          onClick={() => window.open('mailto:contact@instories.fr','_blank')}
        >
          Contact
        </button>
      </header>
      <div className="history" ref={historyRef}>
        {msgs.map(m => (
          <div key={m.id} className={`bubble ${m.from}`}>{m.text}</div>
        ))}
        {/* 3️⃣ Loader à trois ronds */}
        {loading && (
          <div className="loader">
            <span /><span /><span />
          </div>
        )}
      </div>
      <footer className="footer">
        <form onSubmit={e => { e.preventDefault(); sendMessage(inputValue); }}>
        {/* Champ contrôlé par inputValue */}
<input
name="input"
placeholder="Votre message…"
value={inputValue}
onChange={e => setInputValue(e.target.value)}
/>
        </form>
      </footer>
    </div>
  );
}

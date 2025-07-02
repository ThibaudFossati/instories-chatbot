import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [msgs, setMsgs] = useState([
    { id: 1, text: 'Bienvenue ! Posez votre question.', from: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const historyRef = useRef();

  useEffect(() => {
    const node = historyRef.current;
    if (node) node.scrollTop = node.scrollHeight; // autoscroll
  }, [msgs]);

  const sendMessage = async text => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now(), text, from: 'user' }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      setMsgs(prev => [...prev, { id: Date.now()+1, text: reply, from: 'bot' }]);
    } catch {
      setMsgs(prev => [...prev, { id: Date.now()+2, text: '❌ Erreur, réessaie.', from: 'bot' }]);
    } finally {
      setLoading(false);
      setInputValue('');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        <button className="btn-new" onClick={() => window.open('mailto:contact@instories.fr','_blank')}>
          Contact
        </button>
      </header>

      <div className="history" ref={historyRef}>
        {msgs.map(m => (
          <div key={m.id} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="loader"><span/><span/><span/></div>
        )}
      </div>

      <footer className="footer">
        <form onSubmit={e => { e.preventDefault(); sendMessage(inputValue); }}>
          <input
            name="input"
            placeholder="Votre message…"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn-send">➤</button>
        </form>
      </footer>
    </div>
  );
}

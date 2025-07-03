import React, { useState, useEffect, useRef } from 'react';
import InStoriesChecklist from './components/checklist/InStoriesChecklist';
import './App.css';

export default function App() {
  const [msgs, setMsgs] = useState([
    { id: 1, text: 'Bienvenue ! Posez votre question.', from: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const historyRef = useRef();

  useEffect(() => {
    const node = historyRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [msgs]);

  const sendMessage = async (text) => {
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
      setMsgs(prev => [...prev, { id: Date.now()+2, text: '❌ Erreur, HH réessaie. ', from: 'bot' }]);
    } finally {
      setLoading(false);
      setInputValue('');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        <button className="btn-new" onClick={() => setShowChecklist(!showChecklist)}>
          {showChecklist ? '💬 Revenir au Chat' : '🗂️ Voir Checklist'}
        </button>
      </header>

      {showChecklist ? (
        <InStoriesChecklist />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [msgs, setMsgs]         = useState([{ id:1, text:'Bienvenue ! Posez votre question.', from:'bot' }]);
  const [loading, setLoading]   = useState(false);
  const [inputValue, setInputValue] = useState('');
  const historyRef = useRef();

  // 🔄 scroll en bas à chaque nouveau message
  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [msgs]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    // ajoute message utilisateur
    setMsgs(prev => [...prev, { id:Date.now(), text, from:'user' }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      // ajoute réponse bot
      setMsgs(prev => [...prev, { id:Date.now()+1, text: reply, from:'bot' }]);
    } catch {
      setMsgs(prev => [...prev, { id:Date.now()+2, text:'❌ Erreur, réessaie.', from:'bot' }]);
    } finally {
      setLoading(false);
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
          <div key={m.id} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="loader">
            <span/><span/><span/>
          </div>
        )}
      </div>

      <footer className="footer">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
        >
          <input
            name="input"
            placeholder="Ask, write or search for anything..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </form>
      </footer>
    </div>
  );
}

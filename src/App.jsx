import { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bienvenue ! Posez votre question.", from: 'bot' }
  ]);
  const [options, setOptions] = useState([]);
  const historyRef = useRef(null);

  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [messages, options]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text, from: 'user' };
    setMessages(msgs => [...msgs, userMsg]);
    setOptions([]);

    setTimeout(() => {
      const botMsg = {
        id: Date.now()+1,
        text: `J’ai reçu : "${text}". Choisissez une suite :`
      };
      setMessages(msgs => [...msgs, botMsg]);
      setOptions(['Idée A', 'Idée B', 'Idée C']);
    }, 800);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>InStories Chat</h1>
        <button className="btn-contact" onClick={() => window.open('mailto:contact@instories.fr', '_blank')} aria-label="Contact email">
  <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
    <path d="M2,4H22A2,2 0 0 1 24,6V18A2,2 0 0 1 22,20H2A2,2 0 0 1 0,18V6A2,2 0 0 1 2,4M22,6L12,13L2,6"/>
  </svg>
</button>
      </header>

      <div className="history" ref={historyRef}>
        {messages.map(m => (
          <div key={m.id} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}

        {options.length > 0 && (
          <div className="options">
            {options.map(opt => (
              <button key={opt} className="chip" onClick={() => sendMessage(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <form onSubmit={e => { e.preventDefault(); sendMessage(e.target.input.value); e.target.reset(); }}>
          <input name="input" placeholder="Votre message…" />
          <button type="submit" className="btn-send">➤</button>
        </form>
      </footer>
    </div>
  );
}

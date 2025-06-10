import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bot : Bonjour ! Posez-moi une question.' }
  ]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: 'Vous : ' + input.trim() }]);
    setInput('');
  };

  return (
    <div className="chat-wrap">
      <h2>InStories – Chat</h2>
      <div className="chat-box">
        {messages.map((m, i) => (
          <p key={i} className={m.from}>{m.text}</p>
        ))}
      </div>
      <form onSubmit={send} className="chat-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre message…"
        />
        <button>Envoyer</button>
      </form>
    </div>
  );
}

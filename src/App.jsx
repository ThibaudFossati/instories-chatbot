import React, { useState, useEffect, useRef } from 'react';
import QuickReplies from './components/QuickReplies';
import { suggestionsByTheme } from './data/checklist';
import './styles/global.css';

export default function App() {
  const [msgs, setMsgs] = useState([
    {
      id: Date.now(),
      text:
        "Je suis votre concierge créatif ; chuchotez vos envies, repartez avec un concept signature digne des maisons d’exception.",
      from: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [theme, setTheme] = useState("accueil");
  const historyRef = useRef();

  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [msgs]);

  const pushMsg = (text, from = "user") =>
    setMsgs((prev) => [...prev, { id: Date.now(), text, from }]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    pushMsg(message, "user");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const { reply, nextTheme } = await res.json();
      pushMsg(reply, "bot");
      if (nextTheme) setTheme(nextTheme);
    } catch {
      pushMsg("❌ Erreur, réessaie.", "bot");
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <header className="header">
        <h1>InStories Chat</h1>
      </header>
      <div className="history" ref={historyRef}>
        {msgs.map((m) => (
          <div key={m.id} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="loader">
            <span />
            <span />
            <span />
          </div>
        )}
        <QuickReplies list={suggestionsByTheme[theme] || []} onSelect={sendMessage} />
      </div>
      <form
        className="footer"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputValue);
        }}
      >
        <input
          placeholder="Votre message…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn-send">
          ➤
        </button>
      </form>
    </div>
  );
}

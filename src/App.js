import React, { useState, useEffect, useRef } from "react";
import "./theme-apple.css";

const STORAGE_KEY = "instories-messages";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Bonjour, je suis **InStories**, votre assistant conversationnel dédié à la création haut de gamme. Posez-moi vos questions, je suis à votre écoute.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = { role: "user", content: input, timestamp: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = {
        role: "assistant",
        content: `${data.reply}\n\n— *InStories*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "⚠️ Une erreur est survenue. Veuillez réessayer.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        role: "assistant",
        content:
          "Bonjour, je suis **InStories**, votre assistant conversationnel dédié à la création haut de gamme. Posez-moi vos questions, je suis à votre écoute.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h1>Instories Chatbot</h1>
        <button onClick={clearHistory}>🧽 Effacer</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.role}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            {msg.timestamp && <span className="timestamp">{msg.timestamp}</span>}
          </div>
        ))}
        {loading && (
          <div className="bubble assistant typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <button type="button" className="plus">+</button>
        <input
          type="text"
          placeholder="Écrivez votre message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}

export default App;

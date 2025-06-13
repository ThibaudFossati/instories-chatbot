import React, { useState } from "react";
import "./theme-apple.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
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
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Erreur API:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur de réponse." }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-wrapper">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message ${msg.role === "user" ? "me" : "bot"}`}
        >
          {msg.content}
        </div>
      ))}
      {loading && <div className="message bot">…</div>}
      <input
        type="text"
        placeholder="Écris quelque chose…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
    </div>
  );
}

export default App;

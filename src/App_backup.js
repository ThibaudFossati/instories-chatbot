import React, { useState } from "react";
const [isTyping, setIsTyping] = useState(false);
import "./App.css";

function formatUserInput(text) {
  const corrected = text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(.)(.*)$/, (match, first, rest) => first.toUpperCase() + rest)
    .replace(/(\s*[.?!])?$/, ".");
  return corrected;
}
function App() {
  const [input, setInput] = useState("");
const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Bonjour, je suis InStories — votre assistant créatif. Je peux vous guider, vous inspirer ou vous présenter notre travail en direction artistique. Que puis-je faire pour vous ?" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: formatUserInput(input) }]);
    setInput("");
  setIsTyping(true);
    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Erreur côté client:", error);
    }
  };

  return (
    <div className="app">
      <div className="logo-container">
  <img src="/InStories-logo-picto.png" alt="InStories" className="logo-avatar" />
</div>
      <div className="chat">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="input-bar" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez ici…"
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}

export default App;

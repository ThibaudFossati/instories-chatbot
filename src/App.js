import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Bonjour, je suis InStories — votre assistant créatif. Je peux vous guider, vous inspirer ou vous présenter notre travail en direction artistique. Que puis-je faire pour vous ?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Erreur de réponse." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
        <img src="/InStories-logo-picto.png" alt="InStories" className="logo" />
      </header>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.sender}`}>
            <div className="label">{message.sender === "bot" ? "InStories" : "Vous"}</div>
            <div
              className={`bubble ${message.sender}`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="label">InStories</div>
            <div className="bubble bot typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez ici..."
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}

export default App;

/* styles/global.css */
.history {
  padding-bottom: 140px;
  /* other declarations */
}

@media (max-width: 480px) {
  .history {
    padding-bottom: 180px;
    /* other declarations */
  }
}


/* Ensure chat bubbles are not hidden under the footer */
.history {
  padding-bottom: 220px !important;
}


/* src/App.jsx */
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Je suis votre muse digitale : confiez-moi vos ambitions, et repartez avec des visuels et campagnes social-media qui font rêver.'
    }
  ]);
  // other state declarations...

  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: historyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Example function handling incoming reply from the API
  async function sendMessage(userMessage) {
    // send userMessage to API and get response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();

    // Replace appending full reply with splitting into paragraphs
    const fragments = data.reply.split(/\n{2,}/).map(fragment => fragment.trim()).filter(Boolean);
    setMessages(prev => [
      ...prev,
      ...fragments.map(text => ({ role: 'bot', content: text }))
    ]);
  }

  return (
    <div className="app">
      <div className="history" ref={historyRef}>
        {/* chat messages */}
      </div>
      {/* other JSX */}
    </div>
  );
}

export default App;


/* src/chatService.js */
const systemPrompt = `Vous êtes la “Muse Digitale” InStories : un conseiller en stratégie social media et visuels d’exception. 
Rédigez vos réponses de manière inspirante et conversationnelle, en guidant l’utilisateur vers des solutions concrètes tout en lui proposant des choix clairs à chaque étape.`;

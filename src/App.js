import './theme.css';
import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = { sender: 'Vous', text: message };
    const response = { sender: 'InStories', text: "Très bien, je transforme votre idée en concept visuel..." };

    setHistory([...history, newMessage, response]);
    setMessage('');
  };

  return (
    <div className="app">
  <div className="logo-wrapper">
    <img src="/InStories-logo-picto.png" alt="InStories" className="logo-center" />
  </div>
      <div className="conversation">
        {history.map((entry, index) => (
          <div key={index} className={`line ${entry.sender === 'InStories' ? 'left' : 'right'}`}>
            <span className="sender">{entry.sender}</span>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exprimez une intention, une idée, un mot..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">↵</button>
      </form>
    </div>
  );
}

export default App;

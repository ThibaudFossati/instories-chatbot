import React from 'react';

export default function ChatInput({ onSend, inputValue, setInputValue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(inputValue);
  };

  return (
    <form className="footer" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Votre message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="send-btn">➤</button>
    </form>
  );
}

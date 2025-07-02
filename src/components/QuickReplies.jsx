import React from 'react';
import './QuickReplies.css';

const suggestions = [
  { label: '✨ Idée de contenu', message: 'Donne-moi une idée de contenu engageant' },
  { label: '📌 Stratégie visuelle', message: 'Quelle stratégie visuelle pour ma marque luxe ?' },
  { label: '🚀 Optimiser un post', message: 'Comment optimiser un post Instagram beauté ?' },
];

export default function QuickReplies({ onSend, lastUserMessage }) {
  const isMessageVague = (text) => {
    const vagueTriggers = ['aide', 'conseil', 'idée', 'quoi faire', 'help'];
    return vagueTriggers.some(word => text.toLowerCase().includes(word));
  };

  if (!lastUserMessage || !isMessageVague(lastUserMessage)) return null;

  return (
    <div className="quick-replies">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSend(s.message)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

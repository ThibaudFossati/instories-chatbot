// src/components/QuickReplies.jsx
import React from 'react';
import './QuickReplies.css'; // optionnel pour styliser

export default function QuickReplies({ items, onSelect }) {
  return (
    <div className="quick-replies">
      {items.map((item, idx) => (
        <button
          key={idx}
          className="quick-reply"
          onClick={() => onSelect(item)}
        >
          {idx + 1}. {item.label}
        </button>
      ))}
    </div>
  );
}

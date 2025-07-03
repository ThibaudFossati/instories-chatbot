import React from 'react';
import '../styles/global.css';

export default function QuickReplies({ list = [], onSelect }) {
  if (!list.length) return null;
  return (
    <div className="quick-replies">
      {list.map((item, i) => (
        <button
          key={i}
          className="quick-reply"
          onClick={() => onSelect(item.message)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

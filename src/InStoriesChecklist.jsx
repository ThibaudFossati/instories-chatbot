import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const profils = {
  'Directeur Artistique': ['Stratégie visuelle', 'Moodboard', 'Direction de shooting', serie de visuels' ],
  'Social Media Manager': ['Calendrier éditorial', 'Formats Reels', 'Tonalité de marque']
};

export default function InStoriesChecklist() {
  const [profil, setProfil] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showCTA, setShowCTA] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const count = Object.values(checkedItems).filter(Boolean).length;
    setShowCTA(count >= 5);
  }, [checkedItems]);

  const handleProfilChange = (e) => {
    const selected = e.target.value;
    setProfil(selected);
    setChecklist(profils[selected] || []);
    setCheckedItems({});
    setShowCTA(false);
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Checklist – ${profil}`, 10, 20);
    let y = 30;
    checklist.forEach((item, i) => {
      const checked = checkedItems[i] ? '[x]' : '[ ]';
      doc.text(`${checked} ${item}`, 10, y);
      y += 10;
    });
    doc.save(`InStories-Checklist-${profil.replace(/\s/g, '-')}.pdf`);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('theme-dark');
    setDarkMode(!darkMode);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>🎨 InStories Checklist</h2>
        <button onClick={toggleDarkMode} className="btn-new">
          {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>

      <label htmlFor="profil-select" className="label">Choisissez un profil créatif :</label>
      <select
        id="profil-select"
        value={profil}
        onChange={handleProfilChange}
        className="select"
      >
        <option value="">— Sélectionner —</option>
        {Object.keys(profils).map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {checklist.length > 0 && (
        <ul className="checklist-content">
          {checklist.map((item, index) => (
            <li key={index} style={{ margin: '0.5rem 0' }}>
              <input
                type="checkbox"
                id={`item-${index}`}
                checked={!!checkedItems[index]}
                onChange={() => handleCheckboxChange(index)}
              />
              <label htmlFor={`item-${index}`} style={{ marginLeft: '0.5rem' }}>
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}

      {checklist.length > 0 && (
        <button onClick={exportToPDF} className="btn-new" style={{ marginTop: '1rem' }}>
          💾 Exporter en PDF
        </button>
      )}

      {showCTA && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1.5rem' }}>
          <p>✨ Vous souhaitez aller plus loin ?</p>
          <a href="mailto:contact@instories.fr" className="btn-new">
            ✉️ Contactez-nous : contact@instories.fr
          </a>
        </div>
      )}
    </div>
  );
}

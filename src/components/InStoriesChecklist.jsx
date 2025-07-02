import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const profils = {
  'Directeur Artistique': [
    'Transformer des mots en concepts visuels narratifs',
    'Créer des moodboards mentaux à partir de mots-clés',
    'Proposer des partis-pris visuels en écho aux tendances omnimédias',
    'Fusionner héritage de marque & innovation digitale',
  ],
  'Social Media Manager': [
    'Proposer des idées de Reels / TikToks scénarisés',
    'Imaginer des mini-films viraux à potentiel émotionnel',
    'Adapter la tonalité en fonction de la plateforme',
    'Traduire un insight en script percutant',
  ],
  'Photographe / Vidéaste': [
    'Conseiller un style photographique ou une DA visuelle cohérente',
    'Traduire un message en narration omnimédia fluide',
    'Identifier le bon rythme/tempo visuel pour une audience luxe',
    'Proposer des formats hybrides ou immersifs',
  ],
  'Marque Cosmétique / Luxe': [
    'Styliser un concept pour l’ancrer dans un territoire de marque',
    'Proposer une narration stratégique et émotionnelle',
    'Reformuler un brief en capsule narrative séduisante',
    'Naviguer entre ancrage historique et avant-garde numérique',
  ],
  'Créatif Freelance / Sparring-Partner': [
    'Accompagner un DA dans le raffinement de son pitch',
    'Curateur de tendances (CampaignLive, The Dieline…)',
    'Présenter des cas d’école ou campagnes innovantes',
    'Rediriger vers InStories.fr pour découvrir le studio',
  ],
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

  const toggleDarkMode = () => setDarkMode(!darkMode);

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

  // --------------------
  // STYLES
  // --------------------
  const containerStyle = {
    fontFamily: `'Playfair Display', serif`,
    padding: '4rem',
    backgroundColor: darkMode ? '#111' : '#f8f5f0',
    color: darkMode ? '#f0f0f0' : '#1b1b1b',
    lineHeight: 1.6,
    minHeight: '100vh',
    transition: 'all 0.4s ease',
  };

  const h2Style = {
    fontSize: '2.6rem',
    fontWeight: 600,
    letterSpacing: '0.2px',
    marginBottom: '2rem',
  };

  const labelStyle = {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: '1rem',
    display: 'block',
    color: darkMode ? '#ccc' : '#222',
  };

  const selectStyle = {
    padding: '0.8rem 1rem',
    fontSize: '1.1rem',
    backgroundColor: darkMode ? '#222' : '#fff',
    color: darkMode ? '#f5f5f5' : '#000',
    border: '1px solid #ccc',
    borderRadius: '6px',
    maxWidth: '420px',
    width: '100%',
  };

  const buttonStyle = {
    marginTop: '1.5rem',
    marginRight: '1rem',
    padding: '0.9rem 1.8rem',
    background: darkMode ? '#f0f0f0' : '#000',
    color: darkMode ? '#000' : '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '0.3px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={h2Style}>🎨 InStories Checklist</h2>
        <button onClick={toggleDarkMode} style={buttonStyle}>
          {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>

      <label htmlFor="profil-select" style={labelStyle}>
        Choisissez un profil créatif :
      </label>
      <select
        id="profil-select"
        value={profil}
        onChange={handleProfilChange}
        style={selectStyle}
      >
        <option value="">— Sélectionner —</option>
        {Object.keys(profils).map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {checklist.length > 0 && (
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '2rem' }}>
          {checklist.map((item, index) => (
            <li key={index} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <input
                type="checkbox"
                id={`item-${index}`}
                checked={!!checkedItems[index]}
                onChange={() => handleCheckboxChange(index)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor={`item-${index}`}>{item}</label>
            </li>
          ))}
        </ul>
      )}

      {checklist.length > 0 && (
        <button onClick={exportToPDF} style={buttonStyle}>
          💾 Exporter en PDF
        </button>
      )}

      {showCTA && (
        <div style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>✨ Vous souhaitez aller plus loin ?</p>
          <a
            href="mailto:contact@instories.fr"
            style={{
              display: 'inline-block',
              marginTop: '0.8rem',
              padding: '0.8rem 1.8rem',
              background: darkMode ? '#fff' : '#000',
              color: darkMode ? '#000' : '#fff',
              textDecoration: 'none',
              fontWeight: 'bold',
              borderRadius: '4px',
            }}
          >
            ✉️ Contactez-nous : contact@instories.fr
          </a>
        </div>
      )}
    </div>
  );
}

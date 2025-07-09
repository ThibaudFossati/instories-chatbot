/* eslint-env node */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateReply } from './chatService.js';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10001;

// Sécurité iframe
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  // Autoriser l’iframe uniquement sur instories.fr et instories.squarespace.com
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://instories.fr https://instories.squarespace.com"
  );
  next();
});

// Static + SPA fallback
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// API chat
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const reply = await generateReply(req.body.message);
    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Désolé, une erreur est survenue." });
  }
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log('InStories bot running on http://localhost:' + PORT);
});


// src/server.js – fin de fichier
const PORT = process.env.PORT || 10001;   // <— change 3001 → 10001
app.listen(PORT, () => {
  console.log('✅ InStories bot running on http://localhost:' + PORT);
});
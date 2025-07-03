export { default as Bubble } from './Bubble.jsx';
export { default as InputField } from './InputField.jsx';
export { default as Button } from './Button.jsx';
export { default as Loader } from './Loader.jsx';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; // ← ajouter cette ligne

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Limiter le nombre de requêtes par IP (anti-abus)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: '🚫 Trop de requêtes. Veuillez réessayer plus tard.'
});
app.use(limiter); // ← c’est ici, juste après les app.use existants

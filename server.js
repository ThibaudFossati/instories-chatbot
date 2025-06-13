const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 4000;

/* ───────── Fichiers statiques + fallback React ───────── */
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
);

/* ───────── Lancement du serveur ───────── */
app.listen(PORT, () =>
  console.log(`✅ Backend GPT prêt sur port ${PORT}`)
);

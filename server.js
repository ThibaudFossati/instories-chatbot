import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app  = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'dist')));

/* Catch-all → index.html */
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

app.listen(PORT, () =>
  console.log(`🔗 InStories bot running on http://localhost:${PORT}`)
);

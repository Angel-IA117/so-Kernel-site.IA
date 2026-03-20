// Simple backend en Node.js + Express para servir la web y recibir el formulario de contacto.
// Coloca los archivos frontend en la carpeta "public".
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API para recibir contacto
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).send('Faltan campos requeridos');
  }
  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    created_at: new Date().toISOString()
  };

  // Leer/crear messages.json (simple persistencia)
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let arr = [];
    if (!err && data) {
      try { arr = JSON.parse(data); } catch(e){ arr = []; }
    }
    arr.push(entry);
    fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), (err) => {
      if (err) {
        console.error('Error saving message:', err);
        return res.status(500).send('No se pudo guardar el mensaje');
      }
      return res.status(200).json({ ok: true });
    });
  });
});

// Fallback para SPA/static
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
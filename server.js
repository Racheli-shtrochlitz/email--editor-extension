const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(cors());

let storage = {};
const DB_FILE = './storage.json';

if (fs.existsSync(DB_FILE)) {
  storage = JSON.parse(fs.readFileSync(DB_FILE));
}

app.post('/api/message/:id', (req, res) => {
  const id = req.params.id;
  const { text } = req.body;

  storage[id] = {
    text: text,
    updatedAt: Date.now()
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(storage));
  } catch (e) {
    return res.status(500).json({ success: false, error: 'failed to persist' });
  }

  res.json({ success: true , text: storage[id].text });
});

app.get('/api/message/:id', (req, res) => {
  const id = req.params.id;
  res.json({ text: storage[id] || '' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

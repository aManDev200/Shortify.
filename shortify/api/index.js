const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const urlDatabase = {};

app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const id = shortid.generate();
  urlDatabase[id] = url;

  res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${id}` });
});

app.get('/:id', (req, res) => {
  const url = urlDatabase[req.params.id];
  if (url) {
    return res.redirect(url);
  }
  res.status(404).sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

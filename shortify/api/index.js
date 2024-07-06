const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const { kv } = require('@vercel/kv');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the URL Shortener API" });
});

app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const id = shortid.generate();
  await kv.set(id, url);

  const shortUrl = `${req.protocol}://${req.get('host')}/${id}`;
  res.json({ shortUrl });
});

app.get('/:id', async (req, res) => {
  const url = await kv.get(req.params.id);
  if (url) {
    return res.redirect(url);
  }
  res.status(404).json({ error: 'Short URL not found' });
});

app.get('/api/debug', async (req, res) => {
  const keys = await kv.keys();
  const data = {};
  for (let key of keys) {
    data[key] = await kv.get(key);
  }
  res.json(data);
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

const express = require('express');
const cors = require('cors');
const shortid = require('shortid');

const app = express();

app.use(cors());
app.use(express.json());

const urlDatabase = {};

// New root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the URL Shortener API",
    endpoints: {
      shorten: "/api/shorten",
      redirect: "/:id"
    }
  });
});

app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const id = shortid.generate();
  urlDatabase[id] = url;

  res.json({ shortUrl: `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}/${id}` });
});

app.get('/:id', (req, res) => {
  const url = urlDatabase[req.params.id];
  if (url) {
    return res.redirect(url);
  }
  res.status(404).json({ error: 'Short URL not found' });
});

module.exports = app;

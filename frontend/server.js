const express = require('express');
const shortid = require('shortid');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const urlMap = {};

app.post('/api/shorten', (req, res) => {
  const longUrl = req.body.url;
  if (!longUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    new URL(longUrl);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortCode = shortid.generate();
  urlMap[shortCode] = longUrl;
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  
  res.json({ shortUrl });
});

app.get('/:shortCode', (req, res) => {
  const longUrl = urlMap[req.params.shortCode];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
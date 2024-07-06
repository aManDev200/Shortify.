import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://shortify-backend.vercel.app/api/shorten', { url: longUrl });
      setShortUrl(response.data.shortUrl);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setShortUrl('');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter a long URL"
            required
            className="input"
          />
          <button type="submit" className="button">Shorten</button>
        </form>
        {shortUrl && (
          <div className="result">
            <h2>Shortened URL:</h2>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">{shortUrl}</a>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;

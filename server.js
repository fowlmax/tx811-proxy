const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy all requests to TX811
app.use('/tx811/*', async (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(400).json({ error: 'No authorization header' });

  const tx811Path = req.params[0];
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const tx811Url = `https://txgc.texas811.org/${tx811Path}${queryString}`;

  try {
    const response = await fetch(tx811Url, {
      method: req.method,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    });
    const text = await response.text();
console.log('TICKET DETAIL RESPONSE:', text.substring(0, 500));
res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

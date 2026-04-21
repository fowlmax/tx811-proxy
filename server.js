const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ticket/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const auth = req.headers['authorization'];
  if (!auth) return res.status(400).json({ error: 'No authorization header' });

  try {
    const response = await fetch(`https://txgc.texas811.org/api/v3/ui/ticket/${ticketId}`, {
      headers: { 'Authorization': auth }
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

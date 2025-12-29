const express = require('express');
const path = require('path');

const runDnsCheck = require('./check-dns');
const runNpmCheck = require('./check-npm-mirrors');
const runWhois = require('./whois-domain');

const app = express();
const PORT = 2020;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DNS
app.get('/api/dns', async (req, res) => {
  const result = await runDnsCheck();
  res.json(result);
});

// NPM
app.get('/api/npm', async (req, res) => {
  const result = await runNpmCheck();
  res.json(result);
});

// WHOIS
app.get('/api/whois', async (req, res) => {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: 'domain required' });

  const result = await runWhois(domain);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

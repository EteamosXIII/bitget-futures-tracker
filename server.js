const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

const PRODUCT_TYPES = ['umcbl', 'dmcbl', 'sumcbl'];
const SNAPSHOT_FILE = 'snapshot.json';

async function fetchContracts(productType) {
  const res = await fetch(`https://api.bitget.com/api/mix/v1/market/contracts?productType=${productType}`);
  const json = await res.json();
  return json.data || [];
}

async function getAllContracts() {
  const results = await Promise.all(PRODUCT_TYPES.map(fetchContracts));
  return results.flat();
}

function loadSnapshot() {
  if (fs.existsSync(SNAPSHOT_FILE)) {
    return JSON.parse(fs.readFileSync(SNAPSHOT_FILE));
  }
  return [];
}

function saveSnapshot(data) {
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(data, null, 2));
}

function diffContracts(oldList, newList) {
  const oldSymbols = new Set(oldList.map(c => c.symbol));
  return newList.filter(c => !oldSymbols.has(c.symbol));
}

app.get('/api/new-futures', async (req, res) => {
  const current = await getAllContracts();
  const previous = loadSnapshot();
  const newlyAdded = diffContracts(previous, current);
  saveSnapshot(current);
  res.json({ new: newlyAdded, total: current.length });
});

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
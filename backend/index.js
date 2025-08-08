// Express backend for storing and serving productivity data
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for demo (replace with DB for production)
let allSiteTimes = [];

app.post('/api/times', (req, res) => {
  const { siteTimes } = req.body;
  if (siteTimes) {
    allSiteTimes.push({
      siteTimes,
      timestamp: Date.now()
    });
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'error', message: 'Missing siteTimes' });
  }
});

// Endpoint to get all tracked times
app.get('/api/times', (req, res) => {
  res.json(allSiteTimes);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

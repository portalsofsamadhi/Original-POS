// Node.js/Express fallback for admin dashboard bookings
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ADMIN_TOKEN = 'admin_secret_key_2025';
const BOOKINGS_PATH = path.join(__dirname, '..', 'bookings.json');

router.get('/get-bookings', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  let bookings = [];
  if (fs.existsSync(BOOKINGS_PATH)) {
    try {
      bookings = JSON.parse(fs.readFileSync(BOOKINGS_PATH, 'utf8'));
    } catch {
      bookings = [];
    }
  }
  res.json({ success: true, bookings, count: bookings.length });
});

module.exports = router;

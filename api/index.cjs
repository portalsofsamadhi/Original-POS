// API server entry point for admin dashboard fallback
const express = require('express');
const cors = require('cors');
const getBookings = require('./get-bookings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', getBookings);

const PORT = process.env.ADMIN_API_PORT || 3010;
app.listen(PORT, () => {
  console.log(`Admin API server running on port ${PORT}`);
});


const express = require('express');
const path = require('path');
const port = process.env.PORT || 3004;
const app = express();
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});
app.listen(port, '0.0.0.0', () => console.log(`Static dist server running on http://localhost:${port}`));

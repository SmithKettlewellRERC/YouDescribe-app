const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// Legacy URLs handler.
const legacyUrlsController = require('./controllers/legacyUrlsController');
app.get(`/player.php`, (req, res) => {
  legacyUrlsController.redirect(req, res);
});

// Tha main folder.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// The drain.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

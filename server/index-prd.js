const express = require('express');
const path = require('path');

const port = process.env.PORT || 80;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

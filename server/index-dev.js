const express = require('express');
const path = require('path');
const port = process.env.PORT || 80;
const app = express();

console.log('DEVELOPMENT MODE');
console.log('WILL HOT RELOAD CHANGES');

const webpack = require('webpack');
const webpackConfig = require('../webpack.config.dev');
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

// Legacy URLs handler.
const legacyUrlsController = require('./controllers/legacyUrlsController');
app.get(`/player.php`, (req, res) => {
  legacyUrlsController.redirect(req, res);
});

// The main folder.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// The drain.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

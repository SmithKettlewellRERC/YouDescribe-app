const express = require('express');
const router = express.Router();
const path = require('path');
const port = process.env.PORT || 3000;
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

const legacyUrlsController = require('./controllers/legacyUrlsController');

// const legacyUrls = router.get('/:videoId', legacyUrlsController.redirect);

// app.use(`/index.php`, legacyUrls);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

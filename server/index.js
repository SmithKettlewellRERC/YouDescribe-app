const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

if (process.env.NODE_ENV === 'dev') {
  console.log('DEVELOPMENT MODE');
  console.log('WILL HOT RELOAD CHANGES');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  console.log('PRODUCTION MODE D');
}

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

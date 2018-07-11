const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.dev');

const port = 3000;
const app = express();

console.log('DEVELOPMENT MODE');
console.log('WILL HOT RELOAD CHANGES');

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

// The main folder.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// The drain.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

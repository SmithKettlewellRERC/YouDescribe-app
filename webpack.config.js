const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'client', 'src', 'index.js'),
  ],
  output: {
    path: path.join(__dirname, 'client', 'build', 'assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  stats: {
    colors: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ExtractTextPlugin({
    //   filename: './main.css',
    //   allChunks: true,
    // }),
  ],
  // resolve: {
  //   root: [
  //     path.resolve('./client'),
  //   ],
  // },
};

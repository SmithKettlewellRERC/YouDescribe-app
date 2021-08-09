const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [path.join(__dirname, "client", "src", "index.js")],
  output: {
    path: path.join(__dirname, "client", "build", "assets"),
    publicPath: "/assets/",
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
      },
      /* start of css loader */
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"],
      },
      /* end of css loader */
    ],
  },
  stats: {
    colors: true,
  },
  // plugins: [
  //   new webpack.NoEmitOnErrorsPlugin(),
  // ],
};

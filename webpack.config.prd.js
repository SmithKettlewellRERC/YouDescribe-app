const webpack = require("webpack");
const path = require("path");

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
        exclude: /node_modules\/(?!react-tag-input)/,
        options: {
          presets: ["es2015", "react"],
          plugins: ["transform-es2015-destructuring", "transform-object-rest-spread"]
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"],
      },
    ],
  },
  stats: {
    colors: true,
  },
};
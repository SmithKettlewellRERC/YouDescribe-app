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
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        exclude: /node_modules\/(?!react-tag-input)/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  stats: {
    colors: true,
  },
};
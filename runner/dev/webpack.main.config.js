/*
 * @Author: 羊驼
 * @Date: 2024-04-18 10:39:59
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-18 16:45:18
 * @Description: file content
 */
"use strict";

process.env.BABEL_ENV = "main";

const path = require("path");
const { dependencies } = require("../../package.json");
const webpack = require("webpack");

let mainConfig = {
  entry: {
    main: path.join(__dirname, "../../src/main/index.js"),
  },
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production",
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../../dist/electron"),
  },
  plugins: [
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../../static").replace(/\\/g, "\\\\")}"`,
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".node"],
  },
  target: "electron-main",
};

module.exports = mainConfig;

"use strict";

process.env.BABEL_ENV = "renderer";

const path = require("path");
const { dependencies } = require("../../package.json");
const webpack = require("webpack");

const MinifyPlugin = require("babel-minify-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ["vue", "vuetify", "vue-contextmenujs"];

let rendererConfig = {
  mode: "production",
  devtool: false,
  entry: {
    renderer: path.join(__dirname, "../../src/renderer/main.js"),
  },
  externals: [],
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: "vue-html-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@vue/cli-plugin-babel/preset"],
          },
        },
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 10000,
            name: "imgs/[name]--[folder].[ext]",
          },
        },
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../../src/index.ejs"),
      title: require("../../package.json").name,
      templateParameters(compilation, assets, options) {
        return {
          compilation: compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        };
      },
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      nodeModules: false,
    }),
    // new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "../../static"),
        to: path.join(__dirname, "../../dist/electron/static"),
        ignore: [".*"],
      },
      {
        from: path.join(__dirname, "../../package.json"),
        to: path.join(__dirname, "../../dist/electron/package.json"),
      },
    ]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "initial",
      minChunks: 2,
    },
  },
  performance: {
    maxEntrypointSize: 1024 * 1024 * 10,
    maxAssetSize: 1024 * 1024 * 20,
    hints: "warning",
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../../dist/electron"),
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "../../src/renderer"),
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: [".js", ".vue", ".json", ".css", ".node"],
  },
  target: "electron-renderer",
};

module.exports = rendererConfig;

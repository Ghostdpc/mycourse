const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  entry: "./src/main.js",
  output: { filename: "bundle.js" },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: [/\.m?js$/,/\.vue$/],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "eslint-loader",
        },
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          outputPath: "assets",
          name: "[name].[ext]",
          esModule: false,
        },
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "1111",
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      BASE_URL: "/public/",
    }),
  ],
  mode: "none",
};

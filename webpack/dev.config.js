/* eslint-env node */

var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev';

module.exports = {
  mode: 'development',
  context: path.join(__dirname, '../app'),
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './index'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../app/index.ejs',
      inject: false,
      files: {
        css: [],
        js: ['/dev.js']
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', `.${env}.js`, `.${env}.jsx`]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          configFile: '.eslintrc'
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'dev.js'
  }
};

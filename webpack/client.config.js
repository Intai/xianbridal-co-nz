/* eslint-env node */

var path = require('path'),
    webpack = require('webpack'),
    // BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev';

module.exports = {
  mode: 'production',
  context: path.join(__dirname, '../app'),
  entry: [
    './index'
  ],
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
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
    publicPath: '/static/',
    filename: 'client.js',
    chunkFilename: '[name].client.js'
  }
};

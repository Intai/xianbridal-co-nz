var path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ESLintPlugin = require('eslint-webpack-plugin'),
  env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev'

module.exports = {
  mode: 'development',
  context: path.join(__dirname, '../app'),
  entry: [
    './index',
  ],
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      IMAGES_CDN_DOMAIN: JSON.stringify(process.env.IMAGES_CDN_DOMAIN || '/static/images'),
      WEB_CDN_DOMAIN: JSON.stringify(`${process.env.WEB_CDN_DOMAIN || ''}`),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../app/index.ejs',
      inject: false,
      files: {
        css: [],
        js: ['/dev.js'],
      },
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: 'node_modules',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', `.${env}.js`, `.${env}.jsx`],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'dev.js',
  },
}

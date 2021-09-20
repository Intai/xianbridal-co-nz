var R = require('ramda'),
  path = require('path'),
  webpack = require('webpack'),
  fs = require('fs'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ESLintPlugin = require('eslint-webpack-plugin'),
  env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev'

var isNotSystem = function(name) {
  return !/^(\.|bdux)/.test(name)
}

var getExternalPair = function(name) {
  return [name, 'commonjs ' + name]
}

var getExternalObject = R.pipe(
  R.filter(isNotSystem),
  R.map(getExternalPair),
  R.fromPairs,
)

var getExternals = function() {
  return getExternalObject(
    fs.readdirSync(path.join(__dirname, '../node_modules')))
}

module.exports = {
  mode: 'production',
  target: 'node',
  externals: getExternals(),
  context: path.join(__dirname, '../app'),
  entry: [
    './server',
  ],
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'server.ejs',
      template: '../app/index.ejs',
      head:  '<%- head %>',
      app: '<%- app %>',
      inject: false,
      minify: {
        collapseWhitespace: true,
      },
      files: {
        css: [],
        js: ['/static/client.js'],
      },
    }),
    new ESLintPlugin({
      extensions: ['jjs', 'jsx'],
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
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
    filename: 'server.js',
  },
}
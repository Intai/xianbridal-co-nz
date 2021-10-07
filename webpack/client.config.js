var path = require('path'),
  webpack = require('webpack'),
  // BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  ESLintPlugin = require('eslint-webpack-plugin'),
  env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev',
  digest = process.env.CONTAINER_IMAGE || ''

module.exports = {
  mode: 'production',
  context: path.join(__dirname, '../app'),
  entry: [
    './index',
  ],
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
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
    publicPath: `/static-${digest}/`,
    filename: 'client.js',
    chunkFilename: '[name].client.js',
  },
}

/* eslint-env node */

var gulp = require('gulp'),
    log = require('fancy-log'),
    PluginError = require('plugin-error'),
    spawn = require('child_process').spawn,
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    WebpackDevServer = require('webpack-dev-server'),
    port = process.env.PORT || 8080;

function dev() {
  new WebpackDevServer(webpack(require('./webpack/dev.config.js')), {
    disableHostCheck: true,
    historyApiFallback: true,
    noInfo: true,
    hot: true
  })
  .listen(port, '0.0.0.0', function(err) {
    if (err) throw new PluginError('webpack-dev-server', err);
    log('[webpack-dev-server]', 'http://localhost:' + port);
  });
}

function buildClient() {
  return gulp.src('app/index.jsx')
    .pipe(webpackStream(require('./webpack/client.config.js'), webpack))
    .pipe(gulp.dest('dist'));
}

function buildServer() {
  return gulp.src('app/server.js')
    .pipe(webpackStream(require('./webpack/server.config.js'), webpack))
    .pipe(gulp.dest('dist'));
}

function prod(cb) {
  var cmd = spawn('node', [
    'dist/server.js'
  ], {
    stdio: 'inherit'
  });

  log('[express]', 'http://localhost:' + port);
  cmd.on('close', cb);
}

const build = gulp.series(
  buildClient,
  buildServer
)

const server = gulp.series(
  build,
  prod
)

gulp.task('build', build);

gulp.task('server', server);

gulp.task('dev', dev);

gulp.task('default', dev);

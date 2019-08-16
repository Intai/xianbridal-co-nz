/* eslint-env node */

var gulp = require('gulp'),
    del = require('del'),
    log = require('fancy-log'),
    PluginError = require('plugin-error'),
    spawn = require('child_process').spawn,
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    WebpackDevServer = require('webpack-dev-server'),
    port = process.env.PORT || 8080;

function clean() {
  return del('dist');
}

function devServer() {
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

function copyStatic() {
  return gulp.src('static/**/*')
    .pipe(gulp.dest('dist'))
}

function setEnv(env) {
  return function setNodeEnv(cb) {
    process.env.NODE_ENV = env;
    cb();
  }
}

function prodServer(cb) {
  var cmd = spawn('node', [
    'dist/server.js'
  ], {
    stdio: 'inherit'
  });

  log('[express]', 'http://localhost:' + port);
  cmd.on('close', cb);
}

const build = gulp.series(
  clean,
  buildClient,
  buildServer,
  copyStatic
)

const prod = gulp.series(
  setEnv('production'),
  build,
  prodServer
)

const dev = gulp.series(
  clean,
  copyStatic,
  devServer
)

gulp.task('build', build);

gulp.task('prod', prod);

gulp.task('dev', dev);

gulp.task('default', dev);

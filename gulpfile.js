//watchfyで監視して、browserifyでコンパイル
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var electron = require('electron-connect').server.create();
var plugins = require('gulp-load-plugins')();
var babelify = require('babelify');
var packager = require('electron-packager');
var distDir = 'dist';
var releaseDir = 'release';

gulp.task('serve', function() {
  electron.start();
});

gulp.task('reload', function() {
  electron.reload();
});

//watch
gulp.task('watch', function() {
  gulp.watch("src/**/*.{html,jsx}", ["build", "html"]);
});

gulp.task('watch:js', function() {
  gulp.watch(distDir + '/**/*.{html,js}', ['reload']);
});

gulp.task('html', function() {
  return gulp.src('src/**/*.{html,css}')
      .pipe(gulp.dest(distDir));
});

gulp.task('build', function() {
  return gulp.src(['src/js/**/*.{js,jsx}'])
    .pipe(plugins.sourcemaps.init())
    .pipe(
      plugins.babel({
        presets: ['es2015', 'stage-0', 'react'],
        plugins: ['transform-decorators-legacy', 'transform-class-properties']
      })
    )
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(distDir + '/js'))
    ;
});

// Package for each platforms
gulp.task('package', ['win32', 'darwin', 'linux'].map(function (platform) {
  var taskName = 'package:' + platform;
  gulp.task(taskName, ['build'], function (done) {
    packager({
      dir: '.',
      name: 'ETApp',
      arch: 'x64',
      platform: platform,
      out: releaseDir + '/' + platform,
      version: '0.36.2'
    }, function (err) {
      done();
    });
  });
  return taskName;
}));

gulp.task('default', ["serve", "build", "html", "watch", 'watch:js']);
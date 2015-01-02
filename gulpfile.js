var gulp = require('gulp');
var karma = require('karma');
var $ = require('gulp-load-plugins')();

var pkg = require('./package.json');

require('./libs/config')();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Error hander
var handler = function (err) {
  $.util.beep();
  $.util.log($.util.colors.red(err.name), err.message);
};

// Env development
gulp.task('env:development', function (callback) {
  process.env.NODE_ENV = 'development';
  callback();
});

// Env test
gulp.task('env:test', function (callback) {
  process.env.NODE_ENV = 'test';
  callback();
});

// Env production
gulp.task('env:production', function (callback) {
  process.env.NODE_ENV = 'production';
  callback();
});

// Clean
gulp.task('clean', function (callback) {
  var del = require('del');
  del(['.tmp', 'dist'], callback);
});

// Jshint
gulp.task('jshint', function () {
  return gulp.src(['config/**/*.js', 'controllers/**/*.js', 'libs/**/*.js', 'models/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

// Font
gulp.task('fonts', function () {
  gulp.src(['public/components/ionicons/fonts/*.{eot,svg,ttf,woff}'])
    .pipe(gulp.dest('.tmp/public/fonts'))
    .pipe($.size());
  return;
});

// Styles
gulp.task('styles', function () {
  return gulp.src(['public/styles/*.less'])
    .pipe($.plumber({
      errorHandler: handler
    }))
    .pipe($.less({
      dumpLineNumbers: 'comments'
    }))
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe($.size());
});

// Scripts Modernizr
gulp.task('scripts:modernizr', function () {
  return gulp.src(['public/components/modernizr/modernizr.js'])
    .pipe($.modulizr([
      'cssclasses',
      'touch'
    ]))
    .pipe($.concat('modernizr.js'))
    .pipe(gulp.dest('.tmp/public/scripts/'))
    .pipe($.size());
});

// Scripts Vendor
gulp.task('scripts:vendor', ['scripts:modernizr'], function () {
  var buckets = {};
  var setting = adou.config.setting, upyun = adou.config.upyun;
  for (var i = 0; i < upyun.buckets.length; i++) {
    var bucket = upyun.buckets[i];
    buckets[bucket.name] = buckets.url;
  }

  var script = JSON.stringify({
    title: setting.title,
    description: setting.description,
    upyun: {
      api: upyun.api,
      buckets: buckets
    }
  });

  return gulp.src(pkg.vendors)
    .pipe($.sourcemaps.init())
    .pipe($.concat('vendor.js'))
    .pipe($.insert.append('var adou = ' + script + ';'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/scripts'))
    .pipe($.size());
});

// Scripts Browserify
gulp.task('scripts:browserify', function () {
  return gulp.src(['public/scripts/*.js'], {read: false})
    .pipe($.plumber({errorHandler: handler}))
    .pipe($.browserify({debug: true}))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp/public/scripts'))
    .pipe($.size());
});

// Scripts
gulp.task('scripts', ['scripts:vendor', 'scripts:browserify']);

// Watch
gulp.task('watch', function () {
  gulp.watch('public/styles/**/*.less', ['styles']);
  gulp.watch('public/scripts/**/*.js', ['scripts:browserify']);
});

// Serve
gulp.task('serve', function () {
  $.nodemon({
    script: 'bin/www',
    ignore: ['gulpfile.js', '.tmp/**', 'dist/**', 'node_modules/**', 'docs/**', 'public/**', 'test/**', 'commands/**']
  }).on('change', ['jshint']).on('restart', function () {
    console.log('restarted!');
  });
});

// 开发
gulp.task('develop', ['env:development', 'clean', 'jshint'], function () {
  gulp.start('fonts', 'styles', 'scripts', 'watch', 'serve');
});

// Test Mocha
gulp.task('test:mocha', ['env:test'], function (callback) {
  gulp.src(['controllers/**/*.js', 'models/**/*.js'])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/mocha/**/*.js'], {read: false})
        .pipe($.mocha({
          reporter: 'spec',
          timeout: 3000,
          globals: {
            should: require('should')
          }
        }))
        .pipe($.istanbul.writeReports({
          dir: '.',
          reporters: ['text', 'text-summary']
        }))
        .on('end', callback);
    });
});

// Test Karma
gulp.task('test:karma', ['scripts'], function (callback) {
  karma.server.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, callback);
});

gulp.task('mocha', ['test:mocha'], function () {
  process.exit();
});

gulp.task('karma', ['clean', 'test:karma'], function () {
  process.exit();
});

// 测试
gulp.task('test', ['clean', 'test:mocha'], function () {
  gulp.start('test:karma', function () {
    process.exit();
  });
});

// Default
gulp.task('default', ['develop']);

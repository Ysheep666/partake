var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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
gulp.task('development-env', function (callback) {
  process.env.NODE_ENV = 'development';
  callback();
});

// Env test
gulp.task('test-env', function (callback) {
  process.env.NODE_ENV = 'test';
  callback();
});

// Env production
gulp.task('production-env', function (callback) {
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

// Styles
gulp.task('styles', function () {
  gulp.src(['public/styles/**/*.less', '!public/styles/components/**/*.less'])
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
  return;
});

//创建配置文件
gulp.task('create-setting', function () {
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

  var src = require('stream').Readable({
    objectMode: true
  });
  src._read = function () {
    this.push(new $.util.File({
      cwd: '',
      base: '',
      path: 'setting.js',
      contents: new Buffer('var adou = ' + script + ';')
    }));
    return this.push(null);
  };
  return src.pipe(gulp.dest('.tmp/public/scripts'));
});

// Scripts
gulp.task('scripts', ['create-setting'], function () {
  gulp.src(['public/scripts/**/*.js', '!public/scripts/components/**/*.js'], {read: false})
    .pipe($.plumber({errorHandler: handler}))
    .pipe($.browserify({debug: true}))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp/public/scripts'))
    .pipe($.size());
  return;
});

// Watch
gulp.task('watch', function () {
  $.watch('public/styles/**/*.less', function (files, ccallback) {
    gulp.start('styles', ccallback);
  });

  $.watch('public/scripts/**/*.js', function (files, ccallback) {
    gulp.start('scripts', ccallback);
  });
  return;
});

// Serve
gulp.task('serve', function () {
  $.nodemon({
    script: 'bin/www',
    ignore: ['gulpfile.js', '.tmp/**', 'dist/**', 'node_modules/**', 'docs/**', 'public/**', 'test/**', 'commands/**']
  }).on('change', ['lint']).on('restart', function () {
    console.log('restarted!');
  });
});

// 开发
gulp.task('develop', ['development-env', 'clean', 'jshint'], function() {
  return gulp.start('styles', 'scripts', 'watch', 'serve');
});

// Default
gulp.task('default', ['develop']);


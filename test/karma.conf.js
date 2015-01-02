var istanbul = require('browserify-istanbul');

module.exports = function (karma) {
  karma.set({
    basePath: '../',
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      '.tmp/public/scripts/modernizr.js',
      '.tmp/public/scripts/vendor.js',
      'public/components/angular-mocks/angular-mocks.js',
      'public/scripts/default.js',
      'test/karma/**/*.js'
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      'public/scripts/**/*.js': ['coverage', 'browserify']
    },
    reporters: ['spec', 'coverage'],
    browserify: {
      debug: true,
      transform: ['browserify-shim', istanbul({
        ignore: ['**/node_modules/**', '**/test/**'],
        defaultIgnore: true
      })]
    },
    logLevel: 'error',
    singleRun: true,
    coverageReporter: {
      dir: '.',
      reporters: [
        {type: 'text', subdir: '.'},
        {type: 'text-summary', subdir: '.'}
      ]
    }
  });
};

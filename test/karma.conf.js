module.exports = function (karma) {
  karma.set({
    basePath: '../',
    frameworks: ['mocha', 'chai'],
    reporters: ['spec', 'failed', 'coverage'],
    files: [
      '.tmp/public/scripts/modernizr.js',
      '.tmp/public/scripts/vendor.js',
      '.tmp/public/scripts/default.js',
      'public/components/angular-mocks/angular-mocks.js',
      'test/karma/**/*.js'
    ],
    browsers: ['PhantomJS'],
    logLevel: 'error',
    singleRun: true,
    preprocessors: {
      '.tmp/public/scripts/default.js': ['coverage']
    },
    coverageReporter: {
      dir: 'coverage/karma',
      reporters: [
        {type: 'lcov', subdir: '.'},
        {type: 'text', subdir: '.'},
        {type: 'text-summary', subdir: '.'}
      ]
    }
  });
};

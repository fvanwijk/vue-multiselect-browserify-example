module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha', 'chai'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js', // For PhantomJS
      'src/**/*.spec.js'
    ],
    preprocessors: {
      'src/**/*.spec.js': ['browserify']
    },
    browserify: {
      transform: ['vueify', 'babelify']
    },
    reporters: ['progress'],
    singleRun: true
  });
};

const chai = require('chai');
const vueify = require('vueify');
const wallabify = require('wallabify');

module.exports = function (wallaby) {
  return {
    files: [
      { pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false },
      { pattern: 'node_modules/chai/chai.js', instrument: false },
      { pattern: 'node_modules/vue-multiselect/lib/*.js', instrument: false, load: false },
      { pattern: 'src/**/!(*.spec).+(js|vue)', load: false },
    ],
    tests: [
      { pattern: 'src/**/*.spec.js', load: false }
    ],
    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    },
    postprocessor: wallabify({
      entryPatterns: [
        'src/**/*.spec.js'
      ]
    }, b => b.transform(vueify)),
    testFramework: 'mocha',
    setup() {
      chai.should();
      /* eslint no-underscore-dangle:0 */
      window.__moduleBundler.loadTests();
    }
  };
};

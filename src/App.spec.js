import App from './App.vue';

describe('Wallaby config', () => {
  it('should load/run the tests properly', () => {
    App.should.be.ok;
  });
});

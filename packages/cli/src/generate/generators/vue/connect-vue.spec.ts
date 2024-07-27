import { FileSystem } from '../../file-system';
import { connectVue } from './connect-vue';

describe('connectVue', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  it('should update package.json to set up the proxy and change the output dir.', () => {
   fs
    .ensureDir('connector-test/vue')
    .copyFixture('vue/package.json', 'connector-test/vue/package.json');

   connectVue('./connector-test/vue');

   fs
    .assertEqual('connector-test/vue/package.json', 'vue/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectVue('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    fs
      .ensureDir('connector-test/vue');

    connectVue('./connector-test/vue');
  });

});

import { mkdirIfDoesNotExist, rmDirAndFilesIfExist, TestEnvironment } from '../../utils';
import { connectVue } from './connect-vue';

describe('connectVue', () => {

  afterEach(() => rmDirAndFilesIfExist('connector-test'));

  const testEnv = new TestEnvironment('vue');

  it('should update package.json to set up the proxy, install ncp and change the output dir.', () => {
    mkdirIfDoesNotExist('connector-test/vue');

    testEnv
      .copyFileFromMocks('package.json', 'connector-test/vue/package.json');

    connectVue('./connector-test/vue');

    testEnv
      .validateSpec('package.json', 'connector-test/vue/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectVue('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    mkdirIfDoesNotExist('connector-test/vue');

    connectVue('./connector-test/vue');
  });

});

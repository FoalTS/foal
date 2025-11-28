import { FileSystem } from '../../services';
import { ConnectVueCommandService } from './connect-vue-command.service';

describe('ConnectVueCommandService', () => {

  const fs = new FileSystem();
  let service: ConnectVueCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new ConnectVueCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  it('should update package.json to set up the proxy and change the output dir.', () => {
   fs
    .ensureDir('connector-test/vue')
    .copyFixture('vue/package.json', 'connector-test/vue/package.json');

   service.run('./connector-test/vue');

   fs
    .assertEqual('connector-test/vue/package.json', 'vue/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    service.run('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    fs
      .ensureDir('connector-test/vue');

    service.run('./connector-test/vue');
  });

});


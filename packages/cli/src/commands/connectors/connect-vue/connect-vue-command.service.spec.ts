import { FileSystemService, Generator } from '../../../services';
import { ConnectVueCommandService } from './connect-vue-command.service';

describe('ConnectVueCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: ConnectVueCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    generator = new Generator(fileSystem);

    const generator2 = new Generator(fileSystem);
    service = new ConnectVueCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should update package.json to set up the proxy and change the output dir.', () => {
   generator
    .ensureDir('connector-test/vue')
    .copyFixture('vue/package.json', 'connector-test/vue/package.json');

   service.run('./connector-test/vue');

   generator
    .assertEqual('connector-test/vue/package.json', 'vue/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    service.run('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    generator
      .ensureDir('connector-test/vue');

    service.run('./connector-test/vue');
  });

});


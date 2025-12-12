import { FileSystemService, Generator, LoggerService } from '../../../services';
import { ConnectReactCommandService } from './connect-react-command.service';

describe('ConnectReactCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: ConnectReactCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new ConnectReactCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should update package.json and create a .env.development file to set up the proxy.', () => {
    generator
      .ensureDir('connector-test/react')
      .copyFixture('react/package.json', 'connector-test/react/package.json');

    service.run('./connector-test/react');

    generator
      .assertEqual('connector-test/react/package.json', 'react/package.json')
      .assertEqual('connector-test/react/.env.development', 'react/env.development');
  });

  it('should create a .env file with the path to the output dir.', () => {
    generator
      .ensureDir('connector-test/react')
      .copyFixture('react/package.json', 'connector-test/react/package.json');

    service.run('./connector-test/react');

    generator
      .assertEqual('connector-test/react/.env', 'react/env');
  })

  it('should not throw if the path does not exist.', () => {
    service.run('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    generator
      .ensureDir('connector-test/react');

    service.run('./connector-test/react');
  });

});


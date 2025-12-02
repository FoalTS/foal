import { FileSystem } from '../../../services';
import { ConnectReactCommandService } from './connect-react-command.service';

describe('ConnectReactCommandService', () => {

  const fs = new FileSystem();
  let service: ConnectReactCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new ConnectReactCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  it('should update package.json and create a .env.development file to set up the proxy.', () => {
    fs
      .ensureDir('connector-test/react')
      .copyFixture('react/package.json', 'connector-test/react/package.json');

    service.run('./connector-test/react');

    fs
      .assertEqual('connector-test/react/package.json', 'react/package.json')
      .assertEqual('connector-test/react/.env.development', 'react/env.development');
  });

  it('should create a .env file with the path to the output dir.', () => {
    fs
      .ensureDir('connector-test/react')
      .copyFixture('react/package.json', 'connector-test/react/package.json');

    service.run('./connector-test/react');

    fs
      .assertEqual('connector-test/react/.env', 'react/env');
  })

  it('should not throw if the path does not exist.', () => {
    service.run('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    fs
      .ensureDir('connector-test/react');

    service.run('./connector-test/react');
  });

});


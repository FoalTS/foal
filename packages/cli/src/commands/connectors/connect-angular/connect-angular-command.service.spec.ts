import { FileSystemService, Generator, LoggerService } from '../../../services';
import { ConnectAngularCommandService } from './connect-angular-command.service';

// TODO: To improve: make the tests (more) independent from each other.
describe('ConnectAngularCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: ConnectAngularCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new ConnectAngularCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should create a proxy.conf.json file in ${path}/src.', () => {
    generator
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    service.run('./connector-test/angular');

    generator
      .assertEqual('connector-test/angular/src/proxy.conf.json', 'angular/proxy.conf.json');
  });

  it('should not throw if the path does not exist.', () => {
    service.run('somewhere-that-does-not-exist');
  });

  it('should update angular.json with the proxy file and the output dir.', () => {
    generator
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    service.run('./connector-test/angular');

    generator
      .assertEqual('connector-test/angular/angular.json', 'angular/angular.json');
  });

  it('should update angular.json (empty config) with the proxy file and the output dir.', () => {
    generator
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.empty.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    service.run('./connector-test/angular');

    generator
      .assertEqual('connector-test/angular/angular.json', 'angular/angular.empty.json');
  });

  it('should not throw if angular.json does not exist.', () => {
    generator
      .ensureDir('connector-test/angular/src');

    service.run('./connector-test/angular');
  });

  it('should update package.json with the "--prod" flag.', () => {
    generator
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    service.run('./connector-test/angular');

    generator
      .assertEqual('connector-test/angular/package.json', 'angular/package.json');
  });

  it('should not throw if package.json does not exist.', () => {
    generator
      .ensureDir('connector-test/angular/src');

    service.run('./connector-test/angular');
  });

});


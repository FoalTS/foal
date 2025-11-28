import { FileSystem } from '../../../services';
import { connectAngular } from './connect-angular';

// TODO: To improve: make the tests (more) independent from each other.
describe('connectAngular', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  it('should create a proxy.conf.json file in ${path}/src.', () => {
    fs
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    connectAngular('./connector-test/angular');

    fs
      .assertEqual('connector-test/angular/src/proxy.conf.json', 'angular/proxy.conf.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectAngular('somewhere-that-does-not-exist');
  });

  it('should update angular.json with the proxy file and the output dir.', () => {
    fs
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    connectAngular('./connector-test/angular');

    fs
      .assertEqual('connector-test/angular/angular.json', 'angular/angular.json');
  });

  it('should update angular.json (empty config) with the proxy file and the output dir.', () => {
    fs
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.empty.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    connectAngular('./connector-test/angular');

    fs
      .assertEqual('connector-test/angular/angular.json', 'angular/angular.empty.json');
  });

  it('should not throw if angular.json does not exist.', () => {
    fs
      .ensureDir('connector-test/angular/src');

    connectAngular('./connector-test/angular');
  });

  it('should update package.json with the "--prod" flag.', () => {
    fs
      .ensureDir('connector-test/angular/src')
      .copyFixture('angular/angular.json', 'connector-test/angular/angular.json')
      .copyFixture('angular/package.json', 'connector-test/angular/package.json');

    connectAngular('./connector-test/angular');

    fs
      .assertEqual('connector-test/angular/package.json', 'angular/package.json');
  });

  it('should not throw if package.json does not exist.', () => {
    fs
      .ensureDir('connector-test/angular/src');

    connectAngular('./connector-test/angular');
  });

});

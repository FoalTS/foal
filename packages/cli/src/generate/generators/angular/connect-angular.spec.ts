import { mkdirIfDoesNotExist, rmdirIfExists, rmfileIfExists, TestEnvironment } from '../../utils';
import { connectAngular } from './connect-angular';

describe('connectAngular', () => {

  afterEach(() => {
    rmfileIfExists('connector-test/angular/src/proxy.conf.json');
    rmdirIfExists('connector-test/angular/src');
    rmfileIfExists('connector-test/angular/angular.json');
    rmdirIfExists('connector-test/angular');
    rmdirIfExists('connector-test');
  });

  const testEnv = new TestEnvironment('angular');

  it('should create a proxy.conf.json file in ${path}/src.', () => {
    mkdirIfDoesNotExist('connector-test/angular/src');

    testEnv
      .copyFileFromMocks('angular.json', 'connector-test/angular/angular.json');

    connectAngular('./connector-test/angular');

    testEnv
      .validateSpec('proxy.conf.json', 'connector-test/angular/src/proxy.conf.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectAngular('somewhere-that-does-not-exist');
  });

  it('should update angular.json with the proxy file and the output dir.', () => {
    mkdirIfDoesNotExist('connector-test/angular/src');

    testEnv
      .copyFileFromMocks('angular.json', 'connector-test/angular/angular.json');

    connectAngular('./connector-test/angular');

    testEnv
      .validateSpec('angular.json', 'connector-test/angular/angular.json');
  });

  it('should not throw if angular.json does not exist.', () => {
    mkdirIfDoesNotExist('connector-test/angular/src');

    connectAngular('./connector-test/angular');
  });

});

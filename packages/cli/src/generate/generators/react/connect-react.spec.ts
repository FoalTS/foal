import { mkdirIfDoesNotExist, rmdirIfExists, rmfileIfExists, TestEnvironment } from '../../utils';
import { connectReact } from './connect-react';

describe('connectReact', () => {

  afterEach(() => {
    rmfileIfExists('connector-test/react/package.json');
    rmdirIfExists('connector-test/react');
    rmdirIfExists('connector-test');
  });

  const testEnv = new TestEnvironment('react');

  it('should update package.json to set up the proxy, install ncp and change the output dir.', () => {
    mkdirIfDoesNotExist('connector-test/react');

    testEnv
      .copyFileFromMocks('package.json', 'connector-test/react/package.json');

    connectReact('./connector-test/react');

    testEnv
      .validateSpec('package.json', 'connector-test/react/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectReact('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    mkdirIfDoesNotExist('connector-test/react');

    connectReact('./connector-test/react');
  });

});

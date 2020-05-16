import { FileSystem } from '../../file-system';
import { connectReact } from './connect-react';

describe('connectReact', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  it('should update package.json to set up the proxy, install ncp and change the output dir.', () => {
    fs
      .ensureDir('connector-test/react')
      .copyMock('react/package.json', 'connector-test/react/package.json');

    connectReact('./connector-test/react');

    fs
      .assertEqual('connector-test/react/package.json', 'react/package.json');
  });

  it('should not throw if the path does not exist.', () => {
    connectReact('somewhere-that-does-not-exist');
  });

  it('should not throw if package.json does not exist.', () => {
    fs
      .ensureDir('connector-test/react');

    connectReact('./connector-test/react');
  });

});

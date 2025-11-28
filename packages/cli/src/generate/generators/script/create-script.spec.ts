// FoalTS
import { FileSystem } from '../../../services';
import { createScript } from './create-script';

describe('createScript', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  it('should copy the empty script file in the proper directory.', () => {
    fs
      .copyFixture('script/package.json', 'package.json')
      .ensureDir('src/scripts');

    createScript({ name: 'test-fooBar' });

    fs
      .cd('src/scripts')
      .assertEqual('test-foo-bar.ts', 'script/test-foo-bar.ts');
  });

});

// FoalTS
import { FileSystem } from '../../services';
import { CreateScriptCommandService } from './create-script-command.service';

describe('CreateScriptCommandService', () => {

  const fs = new FileSystem();
  let service: CreateScriptCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new CreateScriptCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  it('should copy the empty script file in the proper directory.', () => {
    fs
      .copyFixture('script/package.json', 'package.json')
      .ensureDir('src/scripts');

    service.run({ name: 'test-fooBar' });

    fs
      .cd('src/scripts')
      .assertEqual('test-foo-bar.ts', 'script/test-foo-bar.ts');
  });

});


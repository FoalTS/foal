// FoalTS
import { FileSystemService, Generator } from '../../../services';
import { CreateScriptCommandService } from './create-script-command.service';

describe('CreateScriptCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateScriptCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    generator = new Generator(fileSystem);

    const generator2 = new Generator(fileSystem);
    service = new CreateScriptCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should copy the empty script file in the proper directory.', () => {
    generator
      .copyFixture('script/package.json', 'package.json')
      .ensureDir('src/scripts');

    service.run({ name: 'test-fooBar' });

    generator
      .cd('src/scripts')
      .assertEqual('test-foo-bar.ts', 'script/test-foo-bar.ts');
  });

});


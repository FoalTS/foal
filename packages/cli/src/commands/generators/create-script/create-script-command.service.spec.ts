// FoalTS
import { FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateScriptCommandService } from './create-script-command.service';

describe('CreateScriptCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateScriptCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
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


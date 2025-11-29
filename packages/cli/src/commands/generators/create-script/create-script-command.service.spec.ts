// FoalTS
import { Generator } from '../../../services';
import { CreateScriptCommandService } from './create-script-command.service';

describe('CreateScriptCommandService', () => {

  const generator = new Generator();
  let service: CreateScriptCommandService;

  beforeEach(() => {
    generator.setUp();
    const generator2 = new Generator();
    service = new CreateScriptCommandService(generator2);
  });

  afterEach(() => generator.tearDown());

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


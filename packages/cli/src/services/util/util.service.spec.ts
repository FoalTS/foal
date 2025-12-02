// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { UtilService } from './util.service';

describe('UtilService', () => {
  describe('has a "getCommandLineArguments" method that', () => {
    it('should convert the arguments to an object.', () => {
      // npx foal run foo foo=barfoo bar='hello world'
      const argv = [
        '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
        '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
        'run',
        'my-script',
        'prod',
        'foo=barfoo',
        'bar=hello world'
      ];

      const service = new UtilService();
      deepStrictEqual(service.getCommandLineArguments(argv), {
        bar: 'hello world',
        foo: 'barfoo',
        prod: true
      });
    });

    it('should parse the JSON value.', () => {
      const argv = [
        '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
        '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
        'run',
        'my-script',
        'bar={ "foo": "bar" }',
        'foo=3'
      ];

      const service = new UtilService();
      deepStrictEqual(service.getCommandLineArguments(argv), {
        bar: { foo: 'bar' },
        foo: 3
      });
    });
  });
});


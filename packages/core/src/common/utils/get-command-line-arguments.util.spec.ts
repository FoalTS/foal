// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { getCommandLineArguments } from './get-command-line-arguments.util';

describe('getCommandLineArguments', () => {
  it('should convert the arguments to an object.', () => {
    // node foo.js foo=barfoo bar='hello world'
    const argv = [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/projects/FoalTS/foal/foo.js',
      'prod',
      'foo=barfoo',
      'bar=hello world'
    ];

    deepStrictEqual(getCommandLineArguments(argv), {
      bar: 'hello world',
      foo: 'barfoo',
      prod: true
    });
  });

  it('should parse the JSON value.', () => {
    const argv = [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/projects/FoalTS/foal/foo.js',
      'bar={ "foo": "bar" }',
      'foo=3'
    ];

    deepStrictEqual(getCommandLineArguments(argv), {
      bar: { foo: 'bar' },
      foo: 3
    });
  });
});

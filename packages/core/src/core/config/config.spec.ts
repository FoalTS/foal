// std
import { strictEqual, throws } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';

// FoalTS
import { join } from 'path';
import { Config } from './config';
import { ConfigNotFoundError } from './config-not-found.error';
import { ConfigTypeError } from './config-type.error';

function removeFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

const json = JSON.stringify({
  a: {
    b: {
      boolean: false,
      booleanInString: 'false',
      c: 1,
      d: 'env(FOO_BAR)',
      emptyString: ' ',
      number: 1,
      numberInString: '1',
      string: 'hello world',
      trueBooleanInString: 'true',
    }
  }
});
const json2 = JSON.stringify({
  a: {
    b: {
      c: 2
    }
  }
});

const yaml = `a:
  b:
    c: 1
    d: env(FOO_BAR)
`;
const yaml2 = `a:
  b:
    c: 2
`;

const js = 'module.exports = ' + json;
const js2 = 'module.exports = ' + json2;

describe('Config', () => {

  beforeEach(() => {
    Config.clearCache();

    if (!existsSync('config')) {
      mkdirSync('config');
    }
  });

  afterEach(() => {
    delete process.env.FOAL_ENV;
    delete process.env.NODE_ENV;
    delete process.env.FOO_BAR;

    delete require.cache[join(process.cwd(), 'config/default.js')];
    delete require.cache[join(process.cwd(), 'config/development.js')];
    delete require.cache[join(process.cwd(), 'config/test.js')];

    removeFile('config/default.json');
    removeFile('config/default.yml');
    removeFile('config/default.js');
    removeFile('config/test.json');
    removeFile('config/test.yml');
    removeFile('config/test.js');
    removeFile('config/development.json');
    removeFile('config/development.yml');
    removeFile('config/development.js');

    if (existsSync('config')) {
      rmdirSync('config');
    }

    Config.clearCache();
  });

  describe('when the static method "get" is called', () => {

    context('given the static method "set" has been called before', () => {

      beforeEach(() => Config.set('a.b.c', 2));

      it('should return the configuration value provided before.', () => {
        strictEqual(Config.get('a.b.c'), 2);
      });

      context('given the static method "remove" has been called after', () => {

        beforeEach(() => Config.remove('a.b.c'));

        it('should not return the configuration value.', () => {
          strictEqual(Config.get('a.b.c'), undefined);
        });

      });

    });

    function testConfigFile(path: string, fileContent: string, nodeEnv?: string, nodeEnvName = 'NODE_ENV'): void {
      beforeEach(() => {
        writeFileSync(path, fileContent, 'utf8');
        if (nodeEnv) {
          process.env[nodeEnvName] = nodeEnv;
        }
      });

      it('should return the configuration value if the key exists.', () => {
        strictEqual(Config.get('a.b.c'), 1);
      });

      it('should return the configuration value if the key exists (use of env(*)).', () => {
        process.env.FOO_BAR = 'hello world';
        strictEqual(Config.get('a.b.d'), 'hello world');
      });

      it('should return undefined if the key does not exist.', () => {
        strictEqual(Config.get('unknown'), undefined);
      });
    }

    context('given FOAL_ENV is defined and config/${FOAL_ENV}.json exists', () => {
      testConfigFile('config/test.json', json, 'test', 'FOAL_ENV');
    });

    context('given NODE_ENV is defined and config/${NODE_ENV}.json exists', () => {
      testConfigFile('config/test.json', json, 'test');
    });

    context('given NODE_ENV and FOAL_ENV are not defined and config/development.json exists', () => {
      testConfigFile('config/development.json', json);
    });

    context('given FOAL_ENV is defined and config/${FOAL_ENV}.yml exists', () => {
      testConfigFile('config/test.yml', yaml, 'test', 'FOAL_ENV');
    });

    context('given NODE_ENV is defined and config/${NODE_ENV}.yml exists', () => {
      testConfigFile('config/test.yml', yaml, 'test');
    });

    context('given NODE_ENV and FOAL_ENV not defined and config/development.yml exists', () => {
      testConfigFile('config/development.yml', yaml);
    });

    context('given FOAL_ENV is defined and config/${FOAL_ENV}.js exists', () => {
      testConfigFile('config/test.js', js, 'test', 'FOAL_ENV');
    });

    context('given NODE_ENV is defined and config/${NODE_ENV}.js exists', () => {
      testConfigFile('config/test.js', js, 'test');
    });

    context('given NODE_ENV and FOAL_ENV not defined and config/development.js exists', () => {
      testConfigFile('config/development.js', js);
    });

    context('given config/default.json exists', () => {
      testConfigFile('config/default.json', json);
    });

    context('given config/default.yml exists', () => {
      testConfigFile('config/default.yml', yaml);
    });

    context('given config/default.js exists', () => {
      testConfigFile('config/default.js', js);
    });

    context('given multiple config files exist', () => {

      describe('should return the configuration value', () => {

        it('with default.yml overriding default.js', () => {
          writeFileSync('config/default.yml', yaml2);
          writeFileSync('config/default.js', js);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('with default.json overriding default.yml', () => {
          writeFileSync('config/default.json', json2);
          writeFileSync('config/default.yml', yaml);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('with development.js overriding default.json (no NODE_ENV)', () => {
          writeFileSync('config/development.js', js2);
          writeFileSync('config/default.json', json);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('with development.yml overriding development.js (no NODE_ENV)', () => {
          writeFileSync('config/development.yml', yaml2);
          writeFileSync('config/development.js', js);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('with development.json overriding development.yml (no NODE_ENV)', () => {
          writeFileSync('config/development.json', json2);
          writeFileSync('config/development.yml', yaml);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('with values provided in "set" overriding development.json (no NODE_ENV)', () => {
          Config.set('a.b.c', 2);
          writeFileSync('config/development.json', json);

          strictEqual(Config.get('a.b.c'), 2);
        });

        it('and explicit undefined values should not override other defined values.', () => {
          writeFileSync('config/default.js', 'module.exports = { a: "foobar" }');
          writeFileSync('config/development.js', 'module.exports = { a: undefined }');

          strictEqual(Config.get('a'), 'foobar');
        })

      });

      it('should not delete configuration values (deep merge).', () => {
        writeFileSync('config/development.json', json2);
        writeFileSync('config/default.json', json);

        strictEqual(Config.get('a.b.string'), 'hello world');
      });

    });

    context('given no configuration value is found', () => {

      it('should return undefined if no default value is provided.', () => {
        strictEqual(Config.get('a.b.c'), undefined);
      });

      it('should return the default value if provided.', () => {
        strictEqual(Config.get('a.b.c', 'any', 2), 2);
      });

    });

    context('given a type is provided', () => {

      beforeEach(() => writeFileSync('config/default.json', json, 'utf8'));

      context('and type === "string"', () => {

        it('should throw a ConfigTypeError if the configuration value does not have the expected type.', () => {
          strictEqual(Config.get('a.b.string', 'string'), 'hello world');

          throws(
            () => Config.get('a.b.number', 'string'),
            new ConfigTypeError('a.b.number', 'string', 'number'),
          );

          throws(
            () => Config.get('a.b.boolean', 'string'),
            new ConfigTypeError('a.b.boolean', 'string', 'boolean'),
          );
        });

      });

      context('and type === "boolean"', () => {

        it('should convert the configuration value to a boolean if possible.', () => {
          strictEqual(Config.get('a.b.booleanInString', 'boolean'), false);
          strictEqual(Config.get('a.b.trueBooleanInString', 'boolean'), true);
        });

        it('should throw a ConfigTypeError if the configuration value does not have the expected type.', () => {
          strictEqual(Config.get('a.b.boolean', 'boolean'), false);

          throws(
            () => Config.get('a.b.number', 'boolean'),
            new ConfigTypeError('a.b.number', 'boolean', 'number'),
          );

          throws(
            () => Config.get('a.b.string', 'boolean'),
            new ConfigTypeError('a.b.string', 'boolean', 'string'),
          );
        });

      });

      context('and type === "number"', () => {

        it('should convert the configuration value to a number if possible.', () => {
          const actual = Config.get('a.b.numberInString', 'number');
          strictEqual(actual, 1);
        });

        it('should throw a ConfigTypeError if the configuration value does not have the expected type.', () => {
          strictEqual(Config.get('a.b.number', 'number'), 1);

          throws(
            () => Config.get('a.b.boolean', 'number'),
            new ConfigTypeError('a.b.boolean', 'number', 'boolean'),
          );

          throws(
            () => Config.get('a.b.string', 'number'),
            new ConfigTypeError('a.b.string', 'number', 'string'),
          );

          throws(
            () => Config.get('a.b.emptyString', 'number'),
            new ConfigTypeError('a.b.emptyString', 'number', 'string'),
          );
        });

      });

      context('and type === "boolean|string"', () => {

        it('should convert the configuration value to a boolean if possible.', () => {
          strictEqual(Config.get('a.b.booleanInString', 'boolean|string'), false);
          strictEqual(Config.get('a.b.trueBooleanInString', 'boolean|string'), true);
        });

        it('should throw a ConfigTypeError if the configuration value does not have the expected type.', () => {
          strictEqual(Config.get('a.b.string', 'boolean|string'), 'hello world');
          strictEqual(Config.get('a.b.boolean', 'boolean|string'), false);

          throws(
            () => Config.get('a.b.number', 'boolean|string'),
            new ConfigTypeError('a.b.number', 'boolean|string', 'number'),
          );
        });

      });

      context('and type === "number|string"', () => {

        it('should convert the configuration value to a number if possible.', () => {
          const actual = Config.get('a.b.numberInString', 'number|string');
          strictEqual(actual, 1);
        });

        it('should throw a ConfigTypeError if the configuration value does not have the expected type.', () => {
          strictEqual(Config.get('a.b.string', 'number|string'), 'hello world');
          strictEqual(Config.get('a.b.emptyString', 'number|string'), ' ');
          strictEqual(Config.get('a.b.number', 'number|string'), 1);

          throws(
            () => Config.get('a.b.boolean', 'number|string'),
            new ConfigTypeError('a.b.boolean', 'number|string', 'boolean'),
          );
        });

      });

    });

  });

  describe('when the static method "getOrThrow" is called', () => {

    it('should return the configuration value.', () => {
      writeFileSync('config/default.json', json, 'utf8');
      strictEqual(Config.getOrThrow('a.b.c'), 1);
    });

    it('should throw a ConfigNotFoundError if the configuration key has no associated value.', () => {
      throws(
        () => Config.getOrThrow('unknown'),
        new ConfigNotFoundError('unknown'),
      );
      throws(
        () => Config.getOrThrow('unknown', 'any', 'You must provide something.'),
        new ConfigNotFoundError('unknown', 'You must provide something.')
      );
    });

  });

});

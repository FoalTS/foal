// std
import { strictEqual } from 'assert';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { createService } from '../service-manager';
import { Config } from './config';
import { ConfigNotFoundError } from './config-not-found.error';
import { ConfigTypeError } from './config-type.error';

function removeFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

// Compilation tests (types)
// const anyConfig = Config.get('');
// const stringConfig = Config.get<string>('', 'default value');
// const stringConfig2 = Config.get<string|undefined>('');

describe('Config', () => {

  beforeEach(() => Config.clearCache());

  afterEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.BAR_FOO;
    delete process.env.TEST_FOO_FOO_BAR;
    delete process.env.TEST_FOO_FOO_BAR1;
    delete process.env.TEST_FOO_FOO_BAR2;
    delete process.env.TEST_FOO_FOO_BAR3;
    delete process.env.TEST_FOO_FOO_BAR4;
    delete process.env.TEST_FOO_FOO_BAR5;
    delete process.env.TEST_FOO_FOO_BAR6;
    delete process.env.TEST_FOO_FOO_BAR7;
    delete process.env.DB_USERNAME;

    removeFile('.env');
    removeFile('config/default.json');
    removeFile('config/default.yml');
    removeFile('config/test.json');
    removeFile('config/test.yml');
    removeFile('config/development.json');
    removeFile('config/development.yml');

    if (existsSync('config')) {
      rmdirSync('config');
    }
  });

  describe('when get is called (static)', () => {

    it('should return the value of the environment variable if it exists.', () => {
      process.env.TEST_FOO_FOO_BAR = 'value1';
      strictEqual(Config.get('test.foo.fooBar'), 'value1');
    });

    it('should return the value of the .env file if it exists (LF).', () => {
      const fileContent = 'DB_HOST=localhost\nSETTINGS_SESSION_NAME=id\nFOO_BAR=a==\n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('settings.sessionName'), 'id');
      strictEqual(Config.get('foo.bar'), 'a==');
    });

    it('should return the value of the .env file if it exists (CRLF).', () => {
      const fileContent = 'DB_HOST=localhost\r\nSETTINGS_SESSION_NAME=id\r\nFOO_BAR=a==\n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('settings.sessionName'), 'id');
      strictEqual(Config.get('foo.bar'), 'a==');
    });

    it('should return, when NODE_ENV is defined, the value of the config/${NODE_ENV}.json file if it exists.', () => {
      process.env.NODE_ENV = 'test';
      const fileContent = JSON.stringify({
        auth: { subSection: { key1: 'aaa' } }
      });
      mkdirSync('config');
      writeFileSync('config/test.json', fileContent, 'utf8');

      strictEqual(Config.get('auth.subSection.key1'), 'aaa');
    });

    it('should return, when NODE_ENV is defined, the value of the config/${NODE_ENV}.yml file if it exists.', () => {
      process.env.NODE_ENV = 'test';
      const fileContent = 'hh:\n  subSection:\n    au: ji\n';
      mkdirSync('config');
      writeFileSync('config/test.yml', fileContent, 'utf8');

      strictEqual(Config.get('hh.subSection.au'), 'ji');
    });

    it('should return, when NODE_ENV is not defined, the value of the config/development.json '
    + 'file if it exists.', () => {
      const fileContent = JSON.stringify({
        a: 'b'
      });
      mkdirSync('config');
      writeFileSync('config/development.json', fileContent, 'utf8');

      strictEqual(Config.get('a'), 'b');
    });

    it('should return, when NODE_ENV is not defined, the value of the config/development.yml '
    + 'file if it exists.', () => {
      const ymlFileContent = 'c: d';
      mkdirSync('config');
      writeFileSync('config/development.yml', ymlFileContent, 'utf8');

      strictEqual(Config.get('c'), 'd');
    });

    it('should return the value of the config/default.json file if it exists.', () => {
      const fileContent = JSON.stringify({
        jwt: { subSection: { secretOrPublicKey: 'xxx' } }
      });
      mkdirSync('config');
      writeFileSync('config/default.json', fileContent, 'utf8');

      strictEqual(Config.get('jwt.subSection.secretOrPublicKey'), 'xxx');
    });

    it('should return the value of the config/default.yml file if it exists.', () => {
      const fileContent = 'aa:\n  subSection:\n    wx: y\n';
      mkdirSync('config');
      writeFileSync('config/default.yml', fileContent, 'utf8');

      strictEqual(Config.get('aa.subSection.wx'), 'y');
    });

    it('should return undefined if the key does not exist and if no default value is provided.', () => {
      strictEqual(Config.get('aa.bbbCcc.y'), undefined);
    });

    it('should return the default value if the key does not exist.', () => {
      strictEqual(Config.get('aa.bbbCcc.y', false), false);
    });

    it('should look at the different values / files in the correct order.', () => {
      process.env.NODE_ENV = 'test';
      mkdirSync('config');

      const dotEnvFileContent = 'BAR_FOO=foo2';
      const envJSONFileContent = JSON.stringify({ barFoo: 'foo3' });
      const envYAMLFileContent = 'barFoo: foo4';
      const defaultJSONFileContent = JSON.stringify({ barFoo: 'foo5' });
      const defaultYAMLFileContent = 'barFoo: foo6';

      strictEqual(Config.get('barFoo', 'foo7'), 'foo7');

      writeFileSync('config/default.yml', defaultYAMLFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo6');

      writeFileSync('config/default.json', defaultJSONFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo5');

      writeFileSync('config/test.yml', envYAMLFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo4');

      writeFileSync('config/test.json', envJSONFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo3');

      writeFileSync('.env', dotEnvFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo2');

      process.env.BAR_FOO = 'foo1';
      strictEqual(Config.get('barFoo', 'foo7'), 'foo1');
    });

    it('should parse environment variable values.', () => {
      process.env.TEST_FOO_FOO_BAR1 = 'true';
      strictEqual(Config.get('test.foo.fooBar1'), true);

      process.env.TEST_FOO_FOO_BAR2 = 'false';
      strictEqual(Config.get('test.foo.fooBar2'), false);

      process.env.TEST_FOO_FOO_BAR3 = '36';
      strictEqual(Config.get('test.foo.fooBar3'), 36);

      process.env.TEST_FOO_FOO_BAR4 = '4xxj6lkq8';
      strictEqual(Config.get('test.foo.fooBar4'), '4xxj6lkq8');

      process.env.TEST_FOO_FOO_BAR5 = '2e2';
      strictEqual(Config.get('test.foo.fooBar5'), 200);

      process.env.TEST_FOO_FOO_BAR6 = '';
      strictEqual(Config.get('test.foo.fooBar6'), '');

      process.env.TEST_FOO_FOO_BAR7 = '   ';
      strictEqual(Config.get('test.foo.fooBar7'), '   ');
    });

    it('should parse .env values.', () => {
      const fileContent = 'FOO_BAR1=true\nFOO_BAR2=false\r\nFOO_BAR3=42\n'
        + 'FOO_BAR4=4xxj6lkq8\nFOO_BAR5=2e2\nFOO_BAR6=\nFOO_BAR7=   \n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('foo.bar1'), true);
      strictEqual(Config.get('foo.bar2'), false);
      strictEqual(Config.get('foo.bar3'), 42);
      strictEqual(Config.get('foo.bar4'), '4xxj6lkq8');
      strictEqual(Config.get('foo.bar5'), 200);
      strictEqual(Config.get('foo.bar6'), '');
      strictEqual(Config.get('foo.bar7'), '   ');
    });

    describe('should not take too long', () => {

      beforeEach(() => {
        process.env.NODE_ENV = 'test';
        process.env.DB_USERNAME = 'test';
        mkdirSync('config');

        const dotEnvFileContent = 'DB_PASSWORD=foo';
        writeFileSync('.env', dotEnvFileContent, 'utf8');
        const defaultJSONFileContent = JSON.stringify({ barFoo: 'foo3' });
        writeFileSync('config/default.json', defaultJSONFileContent, 'utf8');
        const defaultYAMLFileContent = 'barFoo: foo4';
        writeFileSync('config/default.yml', defaultYAMLFileContent, 'utf8');
        const envJSONFileContent = JSON.stringify({
          jwt: {
            secretOrPublicKey: 'kljdsqjheblajubdqsmk'
          },
          settings: {
            csrf: false,
            debug: false,
            loggerFormat: 'tiny',
            port: 3001,
            sessionSecret: '79120183c32f87b25fbe0da73426dcca',
            staticPath: 'public/',
          }
        });
        writeFileSync('config/test.json', envJSONFileContent, 'utf8');
        const envYAMLFileContent = `app:
    port: 8080
    baseUrl: 'http://localhost'
auth:
    alg: 'RSA'
api:
    authService: http://auth-service:8080
    someUrl: '/blah'`;
        writeFileSync('config/test.yml', envYAMLFileContent, 'utf8');
      });

      it('on first load / caching (< 3ms).', () => {
        function testResponseTime(key: string) {
          delete require.cache[require.resolve('yamljs')];
          const time = process.hrtime();
          Config.get(key);
          const diff = process.hrtime(time);
          strictEqual(diff[0], 0);
          strictEqual(diff[1] < 3e6, true, `Expected Config.get to be executed in less than 3ms. Took ${diff[1]} ns.`);
        }

        testResponseTime('barFoo');
        testResponseTime('settings.sessionSecret');
        testResponseTime('auth.alg');
      });

      it('on first second load  (< 0.1ms).', () => {
        function testResponseTime(key: string) {
          delete require.cache[require.resolve('yamljs')];
          const time = process.hrtime();
          Config.get(key);
          const diff = process.hrtime(time);
          strictEqual(diff[0], 0);
          strictEqual(
            diff[1] < 0.1e6, true,
            `Expected Config.get to be executed in less than 0.1ms. Took ${diff[1]} ns.`
          );
        }

        Config.get('barFoo');
        Config.get('settings.sessionSecret');
        Config.get('auth.alg');

        testResponseTime('barFoo');
        testResponseTime('settings.sessionSecret');
        testResponseTime('auth.alg');
      });
    });

  });

  describe('when get2 is called', () => {

    it('should return the configuration value.', () => {
      process.env.TEST_FOO_FOO_BAR = 'value1';
      strictEqual(Config.get2('test.foo.fooBar'), 'value1');
    });

    it('should return the default value if the key does not exist.', () => {
      strictEqual(Config.get2('aa.bbbCcc.y', 'any', false), false);
    });

    it('should, when type === "boolean", convert the configuration value to a boolean if possible.', () => {
      process.env.TEST_FOO_FOO_BAR = 'true';
      const actual = Config.get2('test.foo.fooBar', 'boolean');
      strictEqual(actual, true);

      process.env.TEST_FOO_FOO_BAR = 'false';
      const actual2 = Config.get2('test.foo.fooBar', 'boolean');
      strictEqual(actual2, false);
    });

    it('should, when type === "number", convert the configuration value to a number if possible.', () => {
      process.env.TEST_FOO_FOO_BAR = '564';
      const actual = Config.get2('test.foo.fooBar', 'number');
      strictEqual(actual, 564);
    });

    it('should, when type === "boolean|string", convert the configuration value to a boolean if possible.', () => {
      process.env.TEST_FOO_FOO_BAR = 'true';
      const actual = Config.get2('test.foo.fooBar', 'boolean|string');
      strictEqual(actual, true);

      process.env.TEST_FOO_FOO_BAR = 'false';
      const actual2 = Config.get2('test.foo.fooBar', 'boolean|string');
      strictEqual(actual2, false);
    });

    it('should throw a ConfigTypeError if the configuration value does not have the expected type (string).', () => {
      const fileContent = JSON.stringify({
        a: 'z',
        b: 1,
        c: true,
      });
      mkdirSync('config');
      writeFileSync('config/default.json', fileContent, 'utf8');

      strictEqual(Config.get2('a', 'string'), 'z');

      try {
        Config.get2('b', 'string');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'b');
        strictEqual(error.expected, 'string');
        strictEqual(error.actual, 'number');
      }

      try {
        Config.get2('c', 'string');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'c');
        strictEqual(error.expected, 'string');
        strictEqual(error.actual, 'boolean');
      }
    });

    it('should throw a ConfigTypeError if the configuration value does not have the expected type (number).', () => {
      const fileContent = JSON.stringify({
        a: 'z',
        b: 1,
        c: true,
        d: '  '
      });
      mkdirSync('config');
      writeFileSync('config/default.json', fileContent, 'utf8');

      try {
        Config.get2('a', 'number');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'a');
        strictEqual(error.expected, 'number');
        strictEqual(error.actual, 'string');
      }

      strictEqual(Config.get2('b', 'number'), 1);

      try {
        Config.get2('c', 'number');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'c');
        strictEqual(error.expected, 'number');
        strictEqual(error.actual, 'boolean');
      }

      try {
        Config.get2('d', 'number');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'd');
        strictEqual(error.expected, 'number');
        strictEqual(error.actual, 'string');
      }
    });

    it('should throw a ConfigTypeError if the configuration value does not have the expected type (boolean).', () => {
      const fileContent = JSON.stringify({
        a: 'z',
        b: 1,
        c: true,
      });
      mkdirSync('config');
      writeFileSync('config/default.json', fileContent, 'utf8');

      try {
        Config.get2('a', 'boolean');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'a');
        strictEqual(error.expected, 'boolean');
        strictEqual(error.actual, 'string');
      }

      try {
        Config.get2('b', 'boolean');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'b');
        strictEqual(error.expected, 'boolean');
        strictEqual(error.actual, 'number');
      }

      strictEqual(Config.get2('c', 'boolean'), true);
    });

    it('should throw a ConfigTypeError if the configuration value does not have the expected type (boolean|string).',
    () => {
      const fileContent = JSON.stringify({
        a: 'z',
        b: 1,
        c: true,
      });
      mkdirSync('config');
      writeFileSync('config/default.json', fileContent, 'utf8');

      strictEqual(Config.get2('a', 'boolean|string'), 'z');

      try {
        Config.get2('b', 'boolean|string');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'b');
        strictEqual(error.expected, 'boolean|string');
        strictEqual(error.actual, 'number');
      }

      strictEqual(Config.get2('c', 'boolean|string'), true);
    });

  });

  describe('when getOrThrow is called', () => {

    it('should return the configuration value.', () => {
      process.env.TEST_FOO_FOO_BAR = 'value1';
      strictEqual(Config.getOrThrow('test.foo.fooBar'), 'value1');
    });

    it('should throw a ConfigNotFoundError if the configuration key has no associated value.', () => {
      try {
        Config.getOrThrow('b');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'b');
      }

      try {
        Config.getOrThrow('b', 'any', 'You must provide something.');
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('The error should be an instance of ConfigTypeError.');
        }
        strictEqual(error.key, 'b');
        strictEqual(error.msg, 'You must provide something.');
      }
    });

  });

  it('should accept to be used as a service.', () => {
    const service = createService(Config);
    strictEqual(service.get('foo', 3), 3);
  });

});

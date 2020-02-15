// std
import { strictEqual } from 'assert';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { Config, ConfigNotFoundError, ConfigTypeError } from './config';
import { createService } from './service-manager';

describe('ConfigTypeError', () => {

  it('should set three properties "key", "expected" and "actual" from the constructor.', () => {
    const err = new ConfigTypeError('settings.xxx', 'string', 'boolean');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.expected, 'string');
    strictEqual(err.actual, 'boolean');
  });

  it('should have the proper message.', () => {
    const err = new ConfigTypeError('settings.xxx', 'string', 'boolean');
    strictEqual(
      err.message,
      'The value of the configuration key "settings.xxx" has an invalid type.\n'
      + '\n'
      + 'Expected a "string", but got a "boolean".'
    );
  });

});

describe('ConfigNotFoundError', () => {

  afterEach(() => delete process.env.NODE_ENV);

  it('should set the property "key" and "msg" from the constructor.', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.msg, undefined);

    const err2 = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(err2.msg, 'You must provide a secret.');
  });

  it('should have the proper message (no NODE_ENV, no msg).', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/development.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/development.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

  it('should have the proper message (custom msg).', () => {
    const err = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'You must provide a secret.\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/development.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/development.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

  it('should have the proper message (custom NODE_ENV).', () => {
    process.env.NODE_ENV = 'production';
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/production.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/production.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

});

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

  let initialEnv: string|undefined;

  before(() => initialEnv = process.env.NODE_ENV);

  beforeEach(() => Config.clearCache());

  afterEach(() => {
    if (initialEnv === undefined) {
      // Assigning undefined to process.env.NODE_ENV makes process.env.NODE_ENV equal to "undefined"!
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = initialEnv;
    }
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

    it('should return the value of the config/${env}.json file if it exists.', () => {
      process.env.NODE_ENV = 'test';
      const fileContent = JSON.stringify({
        auth: { subSection: { key1: 'aaa' } }
      });
      mkdirSync('config');
      writeFileSync('config/test.json', fileContent, 'utf8');

      strictEqual(Config.get('auth.subSection.key1'), 'aaa');
    });

    it('should return the value of the config/{env}.yml file if it exists.', () => {
      process.env.NODE_ENV = 'test';
      const fileContent = 'hh:\n  subSection:\n    au: ji\n';
      mkdirSync('config');
      writeFileSync('config/test.yml', fileContent, 'utf8');

      strictEqual(Config.get('hh.subSection.au'), 'ji');
    });

    it('should return undefined if the key does not exist and if no default value is provided.', () => {
      strictEqual(Config.get('aa.bbbCcc.y'), undefined);
    });

    it('should return the default value if the key does not exist.', () => {
      strictEqual(Config.get('aa.bbbCcc.y', false), false);
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

    it('should use "development" as default environment if none is specified.', () => {
      const fileContent = JSON.stringify({
        a: 'b'
      });
      mkdirSync('config');
      writeFileSync('config/development.json', fileContent, 'utf8');

      const ymlFileContent = 'c: d';
      writeFileSync('config/development.yml', ymlFileContent, 'utf8');

      strictEqual(Config.get('a'), 'b');
      strictEqual(Config.get('c'), 'd');
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

  it('should accept to be used as a service.', () => {
    const service = createService(Config);
    strictEqual(service.get('foo', 3), 3);
  });

});

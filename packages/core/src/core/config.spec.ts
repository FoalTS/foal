// std
import { strictEqual } from 'assert';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { Config } from './config';
import { createService } from './service-manager';

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
      const fileContent = 'DB_HOST=localhost\nSETTINGS_SESSION_NAME=id\nFOO_BAR=3\n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('settings.sessionName'), 'id');
    });

    it('should return the value of the .env file if it exists (CRLF).', () => {
      const fileContent = 'DB_HOST=localhost\r\nSETTINGS_SESSION_NAME=id\r\nFOO_BAR=3\n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('settings.sessionName'), 'id');
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
    });

    it('should parse .env values.', () => {
      const fileContent = 'FOO_BAR1=true\nFOO_BAR2=false\r\nFOO_BAR3=42\n';
      writeFileSync('.env', fileContent, 'utf8');

      strictEqual(Config.get('foo.bar1'), true);
      strictEqual(Config.get('foo.bar2'), false);
      strictEqual(Config.get('foo.bar3'), 42);
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
      const defaultJSONFileContent = JSON.stringify({ barFoo: 'foo3' });
      const defaultYAMLFileContent = 'barFoo: foo4';
      const envJSONFileContent = JSON.stringify({ barFoo: 'foo5' });
      const envYAMLFileContent = 'barFoo: foo6';

      strictEqual(Config.get('barFoo', 'foo7'), 'foo7');

      writeFileSync('config/test.yml', envYAMLFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo6');

      writeFileSync('config/test.json', envJSONFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo5');

      writeFileSync('config/default.yml', defaultYAMLFileContent, 'utf8');
      strictEqual(Config.get('barFoo', 'foo7'), 'foo4');

      writeFileSync('config/default.json', defaultJSONFileContent, 'utf8');
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
            sessionResave: false,
            sessionSaveUninitialized: false,
            sessionSecret: '79120183c32f87b25fbe0da73426dcca',
            staticUrl: 'public/',
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
        testResponseTime('settings.sessionSaveUninitialized');
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
        Config.get('settings.sessionSaveUninitialized');
        Config.get('auth.alg');

        testResponseTime('barFoo');
        testResponseTime('settings.sessionSaveUninitialized');
        testResponseTime('auth.alg');
      });
    });

  });

  it('should accept to be used as a service.', () => {
    const service = createService(Config);
    strictEqual(service.get('foo', 3), 3);
  });

});

// std
import { deepStrictEqual, strictEqual } from 'assert';
import { join } from 'path';
import { mock } from 'node:test';

// FoalTS
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { mkdirIfDoesNotExist, rmDirAndFilesIfExist } from '../generate/utils';
import { runScript } from './run-script';
import { Logger, ServiceManager } from '@foal/core';

function rmfileIfExists(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

describe('runScript', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/scripts');
    rmDirAndFilesIfExist('build/scripts');
    rmfileIfExists('my-script-temp');

    mock.reset();
  });

  it('should log a suitable message if build/scripts/my-script.js and src/scripts/my-script.ts do not exist.', async () => {
    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    await runScript({ name: 'my-script' }, [], services);
    strictEqual(loggerErrorMock.callCount(), 1);

    const actual = loggerErrorMock.calls[0].arguments[0];
    const expected = 'Script "my-script" not found.';

    strictEqual(actual, expected);
  });

  it('should log a suitable message if build/scripts/my-script.js does not exist but '
      + 'src/scripts/my-script.ts exists.', async () => {
    mkdirIfDoesNotExist('src/scripts');
    writeFileSync('src/scripts/my-script.ts', '', 'utf8');

    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    await runScript({ name: 'my-script' }, [], services);

    strictEqual(loggerErrorMock.callCount(), 1);

    const actual = loggerErrorMock.calls[0].arguments[0];
    const expected = 'Script "my-script" not found in build/scripts/ but found in src/scripts/. Did you forget to build it?';

    strictEqual(actual, expected);
  });

  it('should log a suitable message if no function called "main" was found in build/scripts/my-script.js.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    writeFileSync('build/scripts/my-script.js', '', 'utf8');

    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    await runScript({ name: 'my-script' }, [], services);

    strictEqual(loggerErrorMock.callCount(), 1);

    const actual = loggerErrorMock.calls[0].arguments[0];
    const expected = 'No "main" function found in script "my-script".';

    strictEqual(actual, expected);
  });

  it('should validate the process arguments with the schema if it is given.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.schema = { type: 'object', properties: { email: { type: 'string', format: 'email', maxLength: 2 }, password: { type: 'string' }, n: { type: 'number', maximum: 10 } }, required: ['password'] };
    module.exports.main = function main(args) {
      writeFileSync('my-script-temp', JSON.stringify(args), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
      'email=bar',
      'n=11'
    ], services);

    strictEqual(loggerErrorMock.callCount(), 4);

    deepStrictEqual(loggerErrorMock.calls.map(call => call.arguments[0]), [
      'Script arguments must have required property \'password\'.',
      'Script argument "email" must NOT have more than 2 characters.',
      'Script argument "email" must match format "email".',
      'Script argument "n" must be <= 10.',
    ]);
  });

  it('should call the "main" function of build/scripts/my-script.js with the script arguments (no schema).', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = function main(args) {
      writeFileSync('my-script-temp', JSON.stringify(args), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
      'foo=bar',
    ]);

    if (!existsSync('my-script-temp')) {
      throw new Error('The script was not executed');
    }
    const actual = JSON.parse(readFileSync('my-script-temp', 'utf8'));

    deepStrictEqual(actual, {
      foo: 'bar',
    });
  });

  it('should call the "main" function of build/scripts/my-script.js with the script arguments (a schema).', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        hello: { type: 'string', default: 'world' },
      }
    };
    module.exports.main = function main(args) {
      writeFileSync('my-script-temp', JSON.stringify(args), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
      'foo=bar',
    ]);

    if (!existsSync('my-script-temp')) {
      throw new Error('The script was not executed');
    }
    const actual = JSON.parse(readFileSync('my-script-temp', 'utf8'));

    deepStrictEqual(actual, {
      foo: 'bar',
      hello: 'world',
    });
  });

  it('should call the "main" function of build/scripts/my-script.js with a ServiceManager.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    const { ServiceManager } = require('@foal/core');
    module.exports.main = function main(args, services) {
      const isServiceManager = services instanceof ServiceManager;
      writeFileSync('my-script-temp', JSON.stringify({
        isServiceManager
      }), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
      'foo=bar',
    ]);

    if (!existsSync('my-script-temp')) {
      throw new Error('The script was not executed');
    }
    const actual = JSON.parse(readFileSync('my-script-temp', 'utf8'));

    deepStrictEqual(actual, {
      isServiceManager: true,
    });
  });

  it('should catch and log errors thrown in the "main" function.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = function main() {
      throw new Error('Hello world');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
    ], services);

    strictEqual(loggerErrorMock.callCount(), 1);

    const actualMessage = loggerErrorMock.calls[0].arguments[0];
    const actualParameters = loggerErrorMock.calls[0].arguments[1];

    strictEqual(actualMessage, 'Hello world');
    deepStrictEqual(actualParameters?.error, new Error('Hello world'));
  });

  it('should catch and log errors rejected in the "main" function.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = async function main() {
      throw new Error('Hello world');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    const services = new ServiceManager();
    const logger = services.get(Logger);
    const loggerErrorMock = mock.method(logger, 'error', () => {}).mock;

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run',
      'my-script',
    ], services);

    strictEqual(loggerErrorMock.callCount(), 1);

    const actualMessage = loggerErrorMock.calls[0].arguments[0];
    const actualParameters = loggerErrorMock.calls[0].arguments[1];

    strictEqual(actualMessage, 'Hello world');
    deepStrictEqual(actualParameters?.error, new Error('Hello world'));
  });

});

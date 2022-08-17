// std
import { deepStrictEqual, strictEqual } from 'assert';
import { join } from 'path';

// FoalTS
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { mkdirIfDoesNotExist, rmDirAndFilesIfExist } from '../generate/utils';
import { runScript } from './run-script';

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
  });

  it('should log a suitable message if build/scripts/my-script.js and src/scripts/my-script.ts do not exist.', () => {
    let msg;
    const log = (message: any) => msg = message;
    runScript({ name: 'my-script' }, [], log);

    strictEqual(
      msg, 'The script "my-script" does not exist. You can create it by running the command "foal g script my-script".'
    );
  });

  it('should log a suitable message if build/scripts/my-script.js does not exist but '
      + 'src/scripts/my-script.ts exists.', () => {
    mkdirIfDoesNotExist('src/scripts');
    writeFileSync('src/scripts/my-script.ts', '', 'utf8');

    let msg;
    const log = (message: any) => msg = message;
    runScript({ name: 'my-script' }, [], log);

    strictEqual(
      msg,
      'The script "my-script" does not exist in build/scripts/. But it exists in src/scripts/.'
        + ' Please build your script by running the command "npm run build" or using "npm run dev".'
    );
  });

  it('should log a suitable message if no function called "main" was found in build/scripts/my-script.js.', () => {
    mkdirIfDoesNotExist('build/scripts');
    writeFileSync('build/scripts/my-script.js', '', 'utf8');

    let msg;
    const log = (message: any) => msg = message;

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    runScript({ name: 'my-script' }, [], log);

    strictEqual(
      msg,
      'Error: No "main" function was found in build/scripts/my-script.js.'
    );
  });

  it('should validate the process arguments with the schema if it is given.', () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.schema = { type: 'object', additionalProperties: false };
    module.exports.main = function main(args) {
      writeFileSync('my-script-temp', JSON.stringify(args), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    let msg;
    const log = (message: any) => msg = message;

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run-script',
      'my-script',
      'foo=bar',
    ], log);

    strictEqual(
      msg,
      'Error: The command line arguments must NOT have additional properties.'
    );
  });

  it('should call the "main" function of build/scripts/my-script.js with the script arguments (no schema).', () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = function main(args) {
      writeFileSync('my-script-temp', JSON.stringify(args), 'utf8');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run-script',
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

  it('should call the "main" function of build/scripts/my-script.js with the script arguments (a schema).', () => {
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

    runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run-script',
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

  it('should catch and log errors thrown in the "main" function.', () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = function main() {
      throw new Error('Hello world');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    let msg: any;
    const log = (message: any) => msg = message;

    runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run-script',
      'my-script',
    ], log);

    deepStrictEqual(msg, new Error('Hello world'));
  });

  it('should catch and log errors rejected in the "main" function.', async () => {
    mkdirIfDoesNotExist('build/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
    module.exports.main = async function main() {
      throw new Error('Hello world');
    }`;
    writeFileSync('build/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./build/scripts/my-script.js`)];

    let msg: any;
    const log = (message: any) => msg = message;

    await runScript({ name: 'my-script' }, [
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/node',
      '/Users/loicpoullain/.nvm/versions/node/v8.11.3/bin/foal',
      'run-script',
      'my-script',
    ], log);

    deepStrictEqual(msg, new Error('Hello world'));
  });

});

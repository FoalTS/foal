// std
import { deepStrictEqual, strictEqual } from 'assert';
import { join } from 'path';

// FoalTS
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdirIfDoesNotExist, rmdirIfExists, rmfileIfExists } from './generate/utils';
import { runScript } from './run-script';

describe('runScript', () => {

  afterEach(() => {
    rmfileIfExists('src/scripts/my-script.ts');
    rmdirIfExists('src/scripts');
    rmfileIfExists('lib/scripts/my-script.js');
    rmdirIfExists('lib/scripts');
    rmfileIfExists('my-script-temp');
  });

  it('should log a suitable message if lib/scripts/my-script.js and src/scripts/my-script.ts do not exist.', () => {
    let msg;
    const log = message => msg = message;
    runScript('my-script', log);

    strictEqual(
      msg, 'The script "my-script" does not exist. You can create it by running the command "foal g script my-script".'
    );
  });

  it('should log a suitable message if lib/scripts/my-script.js does not exist but '
      + 'src/scripts/my-script.ts exists.', () => {
    mkdirIfDoesNotExist('src/scripts');
    writeFileSync('src/scripts/my-script.ts', '', 'utf8');

    let msg;
    const log = message => msg = message;
    runScript('my-script', log);

    strictEqual(
      msg,
      'The script "my-script" does not exist in lib/scripts/. But it exists in src/scripts/.'
        + ' Please build your script first by running the command "npm run build".'
    );
  });

  it('should log a suitable message if no function called "main" was found in lib/scripts/my-script.js.', () => {
    mkdirIfDoesNotExist('lib/scripts');
    writeFileSync('lib/scripts/my-script.js', '', 'utf8');

    let msg;
    const log = message => msg = message;

    delete require.cache[join(process.cwd(), `./lib/scripts/my-script.js`)];

    runScript('my-script', log);

    strictEqual(
      msg,
      'Error: No "main" function was found in lib/scripts/my-script.js.'
    );
  });

  it('should call the "main" function of lib/scripts/my-script.js with process.argv.', () => {
    mkdirIfDoesNotExist('lib/scripts');
    const scriptContent = `const { writeFileSync } = require('fs');
module.exports.main = function main(argv) {
  writeFileSync('my-script-temp', JSON.stringify(argv), 'utf8');
}`;
    writeFileSync('lib/scripts/my-script.js', scriptContent, 'utf8');

    delete require.cache[join(process.cwd(), `./lib/scripts/my-script.js`)];

    runScript('my-script');

    if (!existsSync('my-script-temp')) {
      throw new Error('The script was not executed');
    }
    const actual = JSON.parse(readFileSync('my-script-temp', 'utf8'));
    deepStrictEqual(actual, process.argv);
  });

});

// std
import { strictEqual } from 'assert';
import { copyFileSync, existsSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// FoalTS
import { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';

export class TestEnvironment {
  constructor(private generatorName: string) {}

  /* Create environment */
  mkdirIfDoesNotExist(path: string) {
    mkdirIfDoesNotExist(path);
  }
  copyFileFromMocks(srcPath: string, destPath?: string) {
    destPath = destPath || srcPath;
    copyFileSync(
      join(__dirname, '../mocks', this.generatorName, srcPath),
      join(destPath)
    );
  }

  /* Remove environment */
  rmdirIfExists(path: string) {
    if (existsSync(path)) {
      rmdirSync(path);
    }
  }
  rmfileIfExists(path: string) {
    if (existsSync(path)) {
      unlinkSync(path);
    }
  }

  /* Test */
  validateSpec(specPath: string, filePath?: string) {
    filePath = filePath || specPath;
    const spec = readFileSync(
      join(__dirname, '../templates-spec', this.generatorName, specPath),
      'utf8'
    );
    const actual = readFileSync(
      filePath,
      'utf8'
    );
    strictEqual(actual, spec);
  }
}

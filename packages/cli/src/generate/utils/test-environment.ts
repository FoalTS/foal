// std
import { ok, strictEqual } from 'assert';
import { copyFileSync, existsSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// FoalTS
import { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';

export class TestEnvironment {
  constructor(private generatorName: string, private root: string) {}

  /* Create environment */
  // mkdirIfDoesNotExist(path: string) {
  //   mkdirIfDoesNotExist(path);
  // }
  // copyFileFromMocks(srcPath: string, destPath?: string) {
  //   destPath = destPath || srcPath;
  //   copyFileSync(
  //     join(__dirname, '../mocks', this.generatorName, srcPath),
  //     join(destPath)
  //   );
  // }

  /* Remove environment */
  rmdirIfExists(path: string) {
    path = join(this.root, path);
    if (existsSync(path)) {
      rmdirSync(path);
    }
  }
  rmfileIfExists(path: string) {
    path = join(this.root, path);
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
      join(this.root, filePath),
      'utf8'
    );
    strictEqual(actual, spec);
    return this;
  }

  validateFileSpec(specPath: string, filePath?: string) {
    filePath = filePath || specPath;
    const spec = readFileSync(
      join(__dirname, '../templates-spec', this.generatorName, specPath),
    );
    const actual = readFileSync(
      join(this.root, filePath),
    );
    ok(actual.equals(spec));
    return this;
  }
}

// std
import { ok, strictEqual } from 'assert';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

// FoalTS
import { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';

export class TestEnvironment {
  constructor(private generatorName: string, private root: string = '') {}

  /* Create environment */
  mkRootDirIfDoesNotExist() {
    if (this.root) {
      mkdirIfDoesNotExist(this.root);
    }
  }
  copyFileFromMocks(srcPath: string, destPath?: string) {
    destPath = destPath || srcPath;
    copyFileSync(
      join(__dirname, '../mocks', this.generatorName, srcPath),
      join(this.root, destPath)
    );
    return this;
  }

  /* Remove environment */
  rmfileIfExists(path: string) {
    path = join(this.root, path);
    if (existsSync(path)) {
      unlinkSync(path);
    }
  }
  rmDirAndFilesIfExist(path: string) {
    const absolutePath = join(this.root, path);
    if (!existsSync(absolutePath)) {
      return;
    }

    const files = readdirSync(absolutePath);
    for (const file of files) {
      const stat = statSync(join(absolutePath, file));
      if (stat.isDirectory()) {
        this.rmDirAndFilesIfExist(join(path, file));
      } else {
        unlinkSync(join(absolutePath, file));
      }
    }

    rmdirSync(absolutePath);
  }

  /* Test */
  validateSpec(specPath: string, filePath?: string) {
    filePath = filePath || specPath;

    const absoluteSpecPath = join(__dirname, '../specs', this.generatorName, specPath);

    if (!existsSync(absoluteSpecPath)) {
      throw new Error(`Spec file not found: ${specPath}`);
    }

    const spec = readFileSync(absoluteSpecPath, 'utf8');
    const actual = readFileSync(join(this.root, filePath), 'utf8');

    strictEqual(actual.replace(/\r\n/g, '\n'), spec.replace(/\r\n/g, '\n'));

    return this;
  }

  validateFileSpec(specPath: string, filePath?: string) {
    filePath = filePath || specPath;

    const absoluteSpecPath = join(__dirname, '../specs', this.generatorName, specPath);

    if (!existsSync(absoluteSpecPath)) {
      throw new Error(`Spec file not found: ${specPath}`);
    }

    const spec = readFileSync(absoluteSpecPath);
    const actual = readFileSync(join(this.root, filePath));

    ok(actual.equals(spec));

    return this;
  }

  shouldNotExist(filePath: string) {
    const exists = existsSync(join(this.root, filePath));
    ok(!exists, `${filePath} should not exist.`);
    return this;
  }
}

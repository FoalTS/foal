// std
import { deepStrictEqual } from 'assert';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync
} from 'fs';
import { dirname, join } from 'path';

// 3p
import { green, red } from 'colors/safe';

function rmDirAndFiles(path: string) {
  const files = readdirSync(path);
  for (const file of files) {
    const stats = statSync(join(path, file));

    if (stats.isDirectory()) {
      rmDirAndFiles(join(path, file));
    } else {
      unlinkSync(join(path, file));
    }
  }

  rmdirSync(path);
}

/**
 * This class provides more methods that Node std "fs".
 * It also allows to create an isolated directory during directory.
 *
 * @export
 * @class FileSystem
 */
export class FileSystem {

  currentDir = '';

  private readonly testDir = 'test-generators';

  /**
   * Change the current working directory.
   *
   * @param {string} path - Relative path of the directory.
   * @returns {this}
   * @memberof FileSystem
   */
  cd(path: string): this {
    this.currentDir = join(this.currentDir, path);
    return this;
  }

  /**
   * Checks if a file or directory exists.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {boolean}
   * @memberof FileSystem
   */
  exists(path: string): boolean {
    return existsSync(this.parse(path));
  }

  /**
   * Recursively ensures that a directory exists. If the directory structure does not
   * exist, it is created.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  ensureDir(path: string): this {
    const dir = dirname(path);
    if (dir !== '.') {
      this.ensureDir(dir);
    }
    if (!existsSync(this.parse(path))) {
      mkdirSync(this.parse(path));
    }
    return this;
  }

  /**
   * Recursively ensures that a directory exists if the condition is true.
   * If the directory structure does not exist, it is created.
   *
   * @param {boolean} condition - The condition.
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  ensureDirOnlyIf(condition: boolean, path: string): this {
    if (condition) {
      this.ensureDir(path);
    }
    return this;
  }

  /**
   * Ensures that the file exists. If the file does not exist, it is created.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  ensureFile(path: string): this {
    if (!existsSync(this.parse(path))) {
      writeFileSync(this.parse(path), '', 'utf8');
    }
    return this;
  }

  /**
   * Copies a file from the `templates` directory.
   *
   * @param {string} src - The source path relative to the `templates/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  copy(src: string, dest: string): this {
    const templatePath = join(__dirname, 'templates', src);
    if (!existsSync(templatePath)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    copyFileSync(
      templatePath,
      this.parse(dest)
    );
    return this;
  }

  /**
   * Copies a file from the `templates` directory if the condition is true.
   *
   * @param {boolean} condition - The condition.
   * @param {string} src - The source path relative to the `templates/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  copyOnlyIf(condition: boolean, src: string, dest: string): this {
    if (condition) {
      this.copy(src, dest);
    }
    return this;
  }

  /**
   * Copies and renders a template from the `templates` directory.
   *
   * @param {string} src - The source path relative to the `templates/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @param {*} locals - The template variables.
   * @returns {this}
   * @memberof FileSystem
   */
  render(src: string, dest: string, locals: any): this {
    const templatePath = join(__dirname, 'templates', src);
    if (!existsSync(templatePath)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    let content = readFileSync(templatePath, 'utf8');
    for (const key in locals) {
      content = content.split(`/* ${key} */`).join(locals[key]);
    }
    writeFileSync(this.parse(dest), content, 'utf8');
    return this;
  }

  /**
   * Copies and renders a template from the `templates` directory if the condition is true.
   *
   * @param {boolean} condition - The condition.
   * @param {string} src - The source path relative to the `templates/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @param {*} locals - The template variables.
   * @returns {this}
   * @memberof FileSystem
   */
  renderOnlyIf(condition: boolean, src: string, dest: string, locals: any): this {
    if (condition) {
      this.render(src, dest, locals);
    }
    return this;
  }

  /**
   * Reads and modifies the content of a file.
   *
   * @param {string} path - The path relative to the client directory.
   * @param {(content: string) => string} callback - The callback that modifies the content.
   * @returns {this}
   * @memberof FileSystem
   */
  modify(path: string, callback: (content: string) => string): this {
    const content = readFileSync(this.parse(path), 'utf8');
    writeFileSync(this.parse(path), callback(content), 'utf8');
    return this;
  }

  /**
   * Reads and modifies the content of a file if the condition is true.
   *
   * @param {boolean} condition - The condition.
   * @param {string} path - The path relative to the client directory.
   * @param {(content: string) => string} callback - The callback that modifies the content.
   * @returns {this}
   * @memberof FileSystem
   */
  modifyOnlyfIf(condition: boolean, path: string, callback: (content: string) => string): this {
    if (condition) {
      this.modify(path, callback);
    }
    return this;
  }

  /**
   * Add a named import at the bottom of the file
   *
   * @param {string} path - The file path relative to the client directory.
   * @param {string} specifier - The import specifier.
   * @param {string} source - The import source.
   * @returns {this}
   * @memberof FileSystem
   */
  addNamedExportIn(path: string, specifier: string, source: string): this {
    this.modify(path, content => `${content}export { ${specifier} } from '${source}';\n`);
    return this;
  }

  /************************
      Testing Methods
  ************************/

  /**
   * Creates the test client directory. Sets current directory to none.
   *
   * @memberof FileSystem
   */
  setUp(): void {
    mkdirSync(this.testDir);
    this.currentDir = '';
  }

  /**
   * Empties and removes the test client directory. Sets current directory to none.
   *
   * @memberof FileSystem
   */
  tearDown(): void {
    rmDirAndFiles(this.testDir);
    this.currentDir = '';
  }

  /**
   * Throws an error if the file or directory does not exist.
   *
   * @param {string} path - The path relative to the client directory.
   * @memberof FileSystem
   */
  assertExists(path: string): void {
    if (!existsSync(this.parse(path))) {
      throw new Error(`The file "${path}" does not exist.`);
    }
  }

  /**
   * Throws an error if the file or directory exists.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  assertNotExists(path: string): this {
    if (existsSync(this.parse(path))) {
      throw new Error(`The file "${path}" should not exist.`);
    }
    return this;
  }

  /**
   * Throws an error if the directory is not empty.
   *
   * @param {string} path - The path relative to the client directory.
   * @memberof FileSystem
   */
  assertEmptyDir(path: string): void {
    if (readdirSync(this.parse(path)).length > 0) {
      throw new Error(`The directory "${path}" should be empty.`);
    }
  }

  /**
   * Throws an error if the two files are different.
   *
   * @param {string} actual - The path relative to the client directory.
   * @param {string} expected - The path relative to the `specs/` directory.
   * @param {{ binary: boolean }} [{ binary }={ binary: true }] - Specify if the file is binary.
   * @returns {this}
   * @memberof FileSystem
   */
  assertEqual(actual: string, expected: string, { binary }: { binary: boolean } = { binary: false }): this {
    const specPath = join(__dirname, 'specs', expected);
    if (!existsSync(specPath)) {
      throw new Error(`The spec file "${expected}" does not exist.`);
    }
    if (binary) {
      deepStrictEqual(
        readFileSync(this.parse(actual)),
        readFileSync(specPath)
      );
    } else {
      const expectedContent = readFileSync(specPath, 'utf8');
      const actualContent = readFileSync(this.parse(actual), 'utf8');
      if (expectedContent !== actualContent) {
        const expectedLines = expectedContent.split('\n');
        const actualLines = actualContent.split('\n');
        let message = `The two files "${actual}" and "${expected}" are not equal.`;
        for (let i = 0; i < Math.max(expectedLines.length, actualLines.length); i++) {
          if (expectedLines[i] !== actualLines[i]) {
            message += `\n\nLine ${i + 1}\n`
            +  `${green(` Expected: ${expectedLines[i]}\n`)}${red(` Actual: ${actualLines[i]}`)}`;
          }
        }
        throw new Error(message);
      }
    }
    return this;
  }

  /**
   * Copies a file from the `mocks` directory.
   *
   * @param {string} src - The source path relative to the `mocks/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  copyMock(src: string, dest: string): this {
    const mockPath = join(__dirname, 'mocks', src);
    if (!existsSync(mockPath)) {
      throw new Error(`The mock file "${src}" does not exist.`);
    }
    copyFileSync(
      mockPath,
      this.parse(dest)
    );
    return this;
  }

  /**
   * Removes a file.
   *
   * @param {string} path - The path relative to the client directory.
   * @memberof FileSystem
   */
  rmfile(path: string): void {
    unlinkSync(this.parse(path));
  }

  private parse(path: string) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST === 'true') {
      return join(this.testDir, this.currentDir, path);
    }
    return join(this.currentDir, path);
  }

}

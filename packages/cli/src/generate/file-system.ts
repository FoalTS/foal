// std
import { deepStrictEqual, strictEqual } from 'assert';
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
import { dirname, join, parse } from 'path';

// 3p
import { cyan, green } from 'colors/safe';

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
 * Error thrown by the FileSystem which aims to be pretty
 * printed without the stacktrace.
 *
 * @export
 * @class ClientError
 * @extends {Error}
 */
export class ClientError extends Error {
  readonly name = 'ClientError';
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

  private readonly testDir = 'test-generators/subdir';
  private logs = true;

  /**
   * Do not show create and update logs.
   *
   * @returns {this}
   * @memberof FileSystem
   */
  hideLogs(): this {
    this.logs = false;
    return this;
  }

  /**
   * Changes the current working directory.
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
   * Changes the current working directory to the project root
   * directory.
   *
   * It searches for the closer package.json containing @foal/core
   * as dependency.
   *
   * @returns {this}
   * @memberof FileSystem
   */
  cdProjectRootDir(): this {
    // "/" on Unix, C:\ on Windows
    const root =  parse(process.cwd()).root;

    while (!this.exists('package.json')) {
      if (join(process.cwd(), this.parse('.')) === root) {
        throw new ClientError(
          'This project is not a FoalTS project. No package.json found.'
        );
      }
      this.cd('..');
    }
    const content = readFileSync(this.parse('package.json'), 'utf8');

    let pkg: any;
    try {
      pkg = JSON.parse(content);
    } catch (error: any) {
      throw new ClientError(
        `The file package.json is not a valid JSON. ${error.message}`
      );
    }

    if (!pkg.dependencies || !pkg.dependencies['@foal/core']) {
      throw new ClientError(
        'This project is not a FoalTS project. The dependency @foal/core is missing in package.json.'
      );
    }

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
      this.logCreate(path);
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
    const templatePath = join(__dirname, '../..', 'templates', src);
    if (!existsSync(templatePath)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    this.logCreate(dest);
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
    const templatePath = join(__dirname, '../..', 'templates', src);
    if (!existsSync(templatePath)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    let content = readFileSync(templatePath, 'utf8');
    for (const key in locals) {
      content = content.split(`/* ${key} */`).join(locals[key]);
    }
    this.logCreate(dest);
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
    if (!existsSync(this.parse(path))) {
      throw new ClientError(`Impossible to modify "${path}": the file does not exist.`);
    }
    const content = readFileSync(this.parse(path), 'utf8');
    this.logUpdate(path);
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
   * Add a named import at the bottom of the file.
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

  /**
   * Adds or extends a named import at the beginning of the file.
   *
   * If an import already exists with this source path, it is completed.
   * If it does not already exist, it is added at the end of all imports.
   *
   * @param {string} path - The file path relative to the client directory.
   * @param {string} specifier - The import specifier.
   * @param {string} source - The import source.
   * @returns {this}
   * @memberof FileSystem
   */
  addOrExtendNamedImportIn(path: string, specifier: string, source: string, options?: { logs: boolean }): this {
    const initialLogs = this.logs;
    if (options) {
      this.logs = options.logs;
    }

    this.modify(path, content => {
      // TODO: add tests to support double quotes.
      const regex = /import (.*) from '(.*)';/g;
      let endPos = 0;

      let specifierAlreadyExists = false;
      const replacedContent = content.replace(regex, (match, p1, p2, offset: number) => {
        endPos = offset + match.length;
        const namedImportRegex = new RegExp(`import {(.*)} from \'(.*)\';`);
        return match.replace(namedImportRegex, (subString, specifiersStr: string, path: string) => {
          if (path !== source) {
            return subString;
          }
          const specifiers = specifiersStr
            .split(',')
            .map(imp => imp.trim());

          if (specifiers.includes(specifier)) {
            specifierAlreadyExists = true;
            return subString;
          }

          const newSpecifiers = specifiers
            .concat(specifier)
            .sort((a, b) => a.localeCompare(b))
            .join(', ');
          return `import { ${newSpecifiers} } from '${source}';`;
        });
      });

      if (specifierAlreadyExists) {
        return content;
      }

      if (replacedContent !== content) {
        return replacedContent;
      }

      const newImport = `import { ${specifier} } from '${source}';`;
      if (endPos === 0) {
        return `${newImport}\n\n${content}`;
      }

      return content.substr(0, endPos) + '\n' + newImport + content.substr(endPos);
    });

    this.logs = initialLogs;

    return this;
  }

  /**
   * Creates or adds an element to the array property of a class.
   *
   * If the class does not exist, this method does nothing.
   *
   * @param {string} path - The file path relative to the client directory.
   * @param {string} className - The class name.
   * @param {string} propertyName - The property name.
   * @param {string} element - The item to add to the array.
   * @returns {this}
   * @memberof FileSystem
   */
  addOrExtendClassArrayPropertyIn(
    path: string, propertyName: string, element: string, options?: { logs: boolean }
  ): this {
    const initialLogs = this.logs;
    if (options) {
      this.logs = options.logs;
    }

    this.modify(path, content => content.replace(
      new RegExp(`class (\\w*|\\w* implements \\w*) {(.*)}`, 's'),
      (match, className: string, p2: string) => {
        if (/^(\s)*$/.test(p2)) {
          return `class ${className} {\n  ${propertyName} = [\n    ${element}\n  ];\n}`;
        }

        const replacedMatch = match.replace(
          new RegExp(`( *)${propertyName} = \\[(.*)\\];`, 's'),
          (_, spaces, content: string) => {
            const items = content
              .replace(/,\n/g, '\n')
              .split('\n')
              .map(e => e.trim())
              .concat(element)
              .map(e => `${spaces}${spaces}${e}`);

            const cleanItems: string[] = [];
            for (const item of items) {
              if (item.trim() !== '') {
                cleanItems.push(item);
              }
            }
            return `${spaces}${propertyName} = [\n${cleanItems.join(',\n')}\n${spaces}];`;
          }
        );

        if (replacedMatch !== match) {
          return replacedMatch;
        }

        return `class ${className} {\n  ${propertyName} = [\n    ${element}\n  ];\n${p2}}`;
      }
    ));

    this.logs = initialLogs;

    return this;
  }

  /**
   * Returns true if the project package.json has this dependency.
   * Returns false otherwise.
   *
   * @param {string} name - The name of the dependency.
   * @returns {boolean}
   * @memberof FileSystem
   */
  projectHasDependency(name: string): boolean {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const pkg = JSON.parse(readFileSync(this.parse('package.json'), 'utf8'));

    this.currentDir = initialCurrentDir;
    return pkg.dependencies.hasOwnProperty(name);
  }

  /**
   * Returns the dependencies of the project package.json.
   *
   * @returns {{ name: string, version: string }[]}
   */
  getProjectDependencies(): { name: string, version: string }[] {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const pkg = JSON.parse(readFileSync(this.parse('package.json'), 'utf8'));

    this.currentDir = initialCurrentDir;
    return Object.keys(pkg.dependencies)
      .map(name => ({ name, version: pkg.dependencies[name] }));
  }

  /**
   * Sets or updates a dependency in the project package.json.
   *
   * @returns {this}
   */
  setOrUpdateProjectDependency(name: string, version: string): this {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const pkg = JSON.parse(readFileSync(this.parse('package.json'), 'utf8'));

    pkg.dependencies[name] = version;

    writeFileSync(this.parse('package.json'), JSON.stringify(pkg, null, 2));

    this.currentDir = initialCurrentDir;
    return this;
  }

  /**
   * Set or updates a dependency in the project package.json if the condition is true.
   *
   * @returns {this}
   */
  setOrUpdateProjectDependencyOnlyIf(condition: boolean, name: string, version: string): this {
    if (condition) {
      this.setOrUpdateProjectDependency(name, version);
    }
    return this;
  }

  /**
   * Returns the dev dependencies of the project package.json.
   *
   * @returns {{ name: string, version: string }[]}
   */
  getProjectDevDependencies(): { name: string, version: string }[] {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const pkg = JSON.parse(readFileSync(this.parse('package.json'), 'utf8'));

    this.currentDir = initialCurrentDir;
    return Object.keys(pkg.devDependencies)
      .map(name => ({ name, version: pkg.devDependencies[name] }));
  }

  /**
   * Sets or updates a dev dependency in the project package.json.
   *
   * @returns {this}
   */
  setOrUpdateProjectDevDependency(name: string, version: string): this {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const pkg = JSON.parse(readFileSync(this.parse('package.json'), 'utf8'));

    pkg.devDependencies[name] = version;

    writeFileSync(this.parse('package.json'), JSON.stringify(pkg, null, 2));

    this.currentDir = initialCurrentDir;
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
    const [ firstDir ] = this.testDir.split('/');
    mkdirSync(firstDir);
    mkdirSync(this.testDir);
    this.currentDir = '';
  }

  /**
   * Empties and removes the test client directory. Sets current directory to none.
   *
   * @memberof FileSystem
   */
  tearDown(): void {
    const [ firstDir ] = this.testDir.split('/');
    rmDirAndFiles(firstDir);

    this.currentDir = '';
  }

  /**
   * Throws an error if the file or directory does not exist.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  assertExists(path: string): this {
    if (!existsSync(this.parse(path))) {
      throw new Error(`The file "${path}" does not exist.`);
    }
    return this;
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
    const specPath = join(__dirname, '../..', 'specs', expected);
    if (!existsSync(specPath)) {
      throw new Error(`The spec file "${expected}" does not exist.`);
    }
    if (binary) {
      deepStrictEqual(
        readFileSync(this.parse(actual)),
        readFileSync(specPath)
      );
    } else {
      strictEqual(
        readFileSync(this.parse(actual), 'utf8'),
        readFileSync(specPath, 'utf8')
      );
    }
    return this;
  }

  /**
   * Copies a file from the `fixtures` directory.
   *
   * @param {string} src - The source path relative to the `fixtures/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @returns {this}
   * @memberof FileSystem
   */
  copyFixture(src: string, dest: string): this {
    const fixturePath = join(__dirname, '../..', 'fixtures', src);
    if (!existsSync(fixturePath)) {
      throw new Error(`The fixture file "${src}" does not exist.`);
    }
    copyFileSync(
      fixturePath,
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

  private isTestingEnvironment(): boolean {
    return process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST === 'true';
  }

  private parse(path: string) {
    if (this.isTestingEnvironment()) {
      return join(this.testDir, this.currentDir, path);
    }
    return join(this.currentDir, path);
  }

  private logCreate(path: string) {
    path = join(this.currentDir, path);
    //  && !this.options.noLogs
    if (!this.isTestingEnvironment() && this.logs) {
      console.log(`${green('CREATE')} ${path}`);
    }
  }

  private logUpdate(path: string) {
    //  && !this.options.noLogs
    path = join(this.currentDir, path);
    if (!this.isTestingEnvironment() && this.logs) {
      console.log(`${cyan('UPDATE')} ${path}`);
    }
  }

}

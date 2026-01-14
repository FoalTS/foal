// std
import { deepStrictEqual, strictEqual } from 'assert';
import { join, parse } from 'path';

// FoalTS
import { FileSystemService } from '../file-system';
import { LoggerService } from '../logger';

/**
 * Error thrown by the Generator which aims to be pretty
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
 * This class provides more methods that Node std "generator".
 * It also allows to create an isolated directory during directory.
 *
 * @export
 * @class Generator
 */
export class Generator {

  currentDir = '';

  private readonly testDir = 'test-generators/subdir';
  private logs = true;

  constructor(
    private readonly fileSystem: FileSystemService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Do not show create and update logs.
   *
   * @returns {this}
   * @memberof Generator
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
   * @memberof Generator
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
   * @memberof Generator
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
    const packagePath = join(this.currentDir, 'package.json');
    const content = this.fileSystem.readFile(packagePath);

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
   * @memberof Generator
   */
  exists(path: string): boolean {
    const relativePath = join(this.currentDir, path);
    return this.fileSystem.exists(relativePath);
  }

  /**
   * Recursively ensures that a directory exists. If the directory structure does not
   * exist, it is created.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof Generator
   */
  ensureDir(path: string): this {
    const relativePath = join(this.currentDir, path);
    this.fileSystem.mkdir(relativePath);
    return this;
  }

  /**
   * Recursively ensures that a directory exists if the condition is true.
   * If the directory structure does not exist, it is created.
   *
   * @param {boolean} condition - The condition.
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof Generator
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
   * @memberof Generator
   */
  ensureFile(path: string): this {
    const relativePath = join(this.currentDir, path);
    if (!this.fileSystem.exists(relativePath)) {
      this.logCreate(path);
      this.fileSystem.writeFile(relativePath, '');
    }
    return this;
  }

  /**
   * Copies a file from the `templates` directory.
   *
   * @param {string} src - The source path relative to the `templates/` directory.
   * @param {string} dest - The destination path relative to the client directory.
   * @returns {this}
   * @memberof Generator
   */
  copyTemplate(src: string, dest: string): this {
    if (!this.fileSystem.existsTemplate(src)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    this.logCreate(dest);
    this.fileSystem.copyFileFromTemplates(
      src,
      join(this.currentDir, dest)
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
   * @memberof Generator
   */
  copyTemplateOnlyIf(condition: boolean, src: string, dest: string): this {
    if (condition) {
      this.copyTemplate(src, dest);
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
   * @memberof Generator
   */
  render(src: string, dest: string, locals: any): this {
    if (!this.fileSystem.existsTemplate(src)) {
      throw new Error(`The template "${src}" does not exist.`);
    }
    let content = this.fileSystem.readFileFromTemplates(src);
    for (const key in locals) {
      content = content.split(`/* ${key} */`).join(locals[key]);
    }
    this.logCreate(dest);
    this.fileSystem.writeFile(join(this.currentDir, dest), content);
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
   * @memberof Generator
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
   * @memberof Generator
   */
  modify(path: string, callback: (content: string) => string): this {
    const relativePath = join(this.currentDir, path);
    if (!this.fileSystem.exists(relativePath)) {
      throw new ClientError(`Impossible to modify "${path}": the file does not exist.`);
    }
    const content = this.fileSystem.readFile(relativePath);
    this.logUpdate(path);
    this.fileSystem.writeFile(relativePath, callback(content));
    return this;
  }

  /**
   * Reads and modifies the content of a file if the condition is true.
   *
   * @param {boolean} condition - The condition.
   * @param {string} path - The path relative to the client directory.
   * @param {(content: string) => string} callback - The callback that modifies the content.
   * @returns {this}
   * @memberof Generator
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
   * @memberof Generator
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
   * @memberof Generator
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
   * @memberof Generator
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
   * @memberof Generator
   */
  projectHasDependency(name: string): boolean {
    const initialCurrentDir = this.currentDir;

    this.cdProjectRootDir();
    const packagePath = join(this.currentDir, 'package.json');
    const pkg = JSON.parse(this.fileSystem.readFile(packagePath));

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
    const packagePath = join(this.currentDir, 'package.json');
    const pkg = JSON.parse(this.fileSystem.readFile(packagePath));

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
    const packagePath = join(this.currentDir, 'package.json');
    const pkg = JSON.parse(this.fileSystem.readFile(packagePath));

    pkg.dependencies[name] = version;

    this.fileSystem.writeFile(packagePath, JSON.stringify(pkg, null, 2));

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
    const packagePath = join(this.currentDir, 'package.json');
    const pkg = JSON.parse(this.fileSystem.readFile(packagePath));

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
    const packagePath = join(this.currentDir, 'package.json');
    const pkg = JSON.parse(this.fileSystem.readFile(packagePath));

    pkg.devDependencies[name] = version;

    this.fileSystem.writeFile(packagePath, JSON.stringify(pkg, null, 2));

    this.currentDir = initialCurrentDir;
    return this;
  }

  /************************
      Testing Methods
  ************************/

  /**
   * Throws an error if the file or directory does not exist.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof Generator
   */
  assertExists(path: string): this {
    const relativePath = join(this.currentDir, path);
    if (!this.fileSystem.exists(relativePath)) {
      throw new Error(`The file "${path}" does not exist.`);
    }
    return this;
  }

  /**
   * Throws an error if the file or directory exists.
   *
   * @param {string} path - The path relative to the client directory.
   * @returns {this}
   * @memberof Generator
   */
  assertNotExists(path: string): this {
    const relativePath = join(this.currentDir, path);
    if (this.fileSystem.exists(relativePath)) {
      throw new Error(`The file "${path}" should not exist.`);
    }
    return this;
  }

  /**
   * Throws an error if the directory is not empty.
   *
   * @param {string} path - The path relative to the client directory.
   * @memberof Generator
   */
  assertEmptyDir(path: string): void {
    if (!this.fileSystem.isDirectoryEmpty(join(this.currentDir, path))) {
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
   * @memberof Generator
   */
  assertEqual(actual: string, expected: string, { binary }: { binary: boolean } = { binary: false }): this {
    if (!this.fileSystem.existsSpec(expected)) {
      throw new Error(`The spec file "${expected}" does not exist.`);
    }
    if (binary) {
      deepStrictEqual(
        this.fileSystem.readBinaryFile(join(this.currentDir, actual)),
        this.fileSystem.readBinaryFileFromSpecs(expected)
      );
    } else {
      strictEqual(
        this.fileSystem.readFile(join(this.currentDir, actual)),
        this.fileSystem.readFileFromSpecs(expected)
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
   * @memberof Generator
   */
  copyFixture(src: string, dest: string): this {
    if (!this.fileSystem.existsFixture(src)) {
      throw new Error(`The fixture file "${src}" does not exist.`);
    }
    this.fileSystem.copyFileFromFixtures(
      src,
      join(this.currentDir, dest)
    );
    return this;
  }

  /**
   * Removes a file.
   *
   * @param {string} path - The path relative to the client directory.
   * @memberof Generator
   */
  rmfile(path: string): void {
    const relativePath = join(this.currentDir, path);
    this.fileSystem.deleteFile(relativePath);
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
    if (!this.isTestingEnvironment() && this.logs) {
      this.logger.info(path, 'create');
    }
  }

  private logUpdate(path: string) {
    path = join(this.currentDir, path);
    if (!this.isTestingEnvironment() && this.logs) {
      this.logger.info(path, 'update');
    }
  }

}


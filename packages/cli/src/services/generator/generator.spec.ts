// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { ClientError, Generator } from './generator';
import { FileSystemService } from '../file-system';
import { LoggerService } from '../logger';

function rmdir(path: string) {
  if (existsSync(path)) {
    rmdirSync(path);
  }
}

function rmfile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

function mkdir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
}

describe('ClientError', () => {

  it('should inherit from Error', () => {
    strictEqual(new ClientError() instanceof Error, true);
  });

  it('should have a "name" property equal to ClientError', () => {
    strictEqual(new ClientError().name, 'ClientError');
  });

});

describe('Generator', () => {

  let generator: Generator;
  let fileSystem: FileSystemService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);
  });

  describe('has a "cd" method that', () => {

    it('should change the current directory.', () => {
      strictEqual(generator.currentDir, '');
      generator.cd('foobar/foo');
      strictEqual(generator.currentDir.replace(/\\/g, '/'), 'foobar/foo');
      generator.cd('../bar');
      strictEqual(generator.currentDir.replace(/\\/g, '/'), 'foobar/bar');
    });

  });

  describe('has a "cdProjectRootDir" that', () => {

    let cliPkg: Buffer;
    let rootPkg: Buffer;

    before(() => {
      cliPkg = readFileSync('package.json');
      unlinkSync('package.json');

      rootPkg = readFileSync('../../package.json');
      unlinkSync('../../package.json');
    });

    after(() => {
      writeFileSync('../../package.json', rootPkg);
      writeFileSync('package.json', cliPkg);
    });

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir('test-generators/subdir/foo');
      mkdir('test-generators/subdir/foo/bar');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/package.json');
      rmdir('test-generators/subdir/foo/bar');
      rmdir('test-generators/subdir/foo');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should root the current working directory to the project root directory.', () => {
      writeFileSync(
        'test-generators/subdir/package.json',
        JSON.stringify({
          dependencies: {
            '@foal/core': 'versionNumber'
          }
        }),
        'utf8'
      );
      generator.cd('foo/bar');
      generator.cdProjectRootDir();
      strictEqual(generator.currentDir, '.');
    });

    it('should throw a ClienError if the package.json is not a valid JSON.', () => {
      writeFileSync(
        'test-generators/subdir/package.json',
        'hello',
        'utf8'
      );

      generator.cd('foo/bar');
      try {
        generator.cdProjectRootDir();
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        if (!(error instanceof ClientError)) {
          throw new Error('The error thrown should be an instance of ClientError.');
        }

        strictEqual(
          error.message,
          `The file package.json is not a valid JSON. Unexpected token 'h', "hello" is not valid JSON`
        );
      }
    });

    it('should throw a ClienError if the package.json found does not have @foal/core as dependency (no deps).', () => {
      writeFileSync(
        'test-generators/subdir/package.json',
        JSON.stringify({}),
        'utf8'
      );

      generator.cd('foo/bar');
      try {
        generator.cdProjectRootDir();
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        if (!(error instanceof ClientError)) {
          throw new Error('The error thrown should be an instance of ClientError.');
        }
        strictEqual(
          error.message,
          'This project is not a FoalTS project. The dependency @foal/core is missing in package.json.'
        );
      }
    });

    it('should throw a ClienError if the package.json found does not have @foal/core as dependency (>=1 dep).', () => {
      writeFileSync(
        'test-generators/subdir/package.json',
        JSON.stringify({
          dependencies: {}
        }),
        'utf8'
      );

      generator.cd('foo/bar');
      try {
        generator.cdProjectRootDir();
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        if (!(error instanceof ClientError)) {
          throw new Error('The error thrown should be an instance of ClientError.');
        }
        strictEqual(
          error.message,
          'This project is not a FoalTS project. The dependency @foal/core is missing in package.json.'
        );
      }
    });

    it('should throw a ClientError if no package.json is found.', () => {
      generator.cd('foo/bar');
      try {
        generator.cdProjectRootDir();
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        if (!(error instanceof ClientError)) {
          throw new Error('The error thrown should be an instance of ClientError.');
        }
        strictEqual(
          error.message,
          'This project is not a FoalTS project. No package.json found.'
        );
      }
    });

  });

  describe('has a "exists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/foo.txt', Buffer.alloc(3));
    });

    afterEach(() => {
      rmfile('test-generators/subdir/foo.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return true if the file or directory exists.', () => {
      strictEqual(generator.exists('foo.txt'), true);
    });

    it('should return true if the file or directory does not exist.', () => {
      strictEqual(generator.exists('bar.txt'), false);
    });

  });

  describe('has a "ensureDir" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir('test-generators/subdir/foo');
    });

    afterEach(() => {
      rmdir('test-generators/subdir/foo');
      rmdir('test-generators/subdir/bar/foo/foobar');
      rmdir('test-generators/subdir/bar/foo');
      rmdir('test-generators/subdir/bar');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should create the directory if it does not exist.', () => {
      generator.ensureDir('bar');
      if (!existsSync('test-generators/subdir/bar')) {
        throw new Error('The directory "bar" does not exist.');
      }
    });

    it('should not throw if the directory already exists.', () => {
      generator.ensureDir('foo');
    });

    it('should create all intermediate directories.', () => {
      generator.ensureDir('bar/foo/foobar');
      if (!existsSync('test-generators/subdir/bar/foo/foobar')) {
        throw new Error('The directory "bar/foo/foobar" does not exist.');
      }
    });

  });

  describe('has a "ensureDirOnlyIf" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
    });

    afterEach(() => {
      rmdir('test-generators/subdir/foo');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should create the directory if the condition is true.', () => {
      generator.ensureDirOnlyIf(true, 'foo');
      if (!existsSync('test-generators/subdir/foo')) {
        throw new Error('The directory "foo" does not exist.');
      }
    });

    it('should not create the directory if the condition is false.', () => {
      generator.ensureDirOnlyIf(false, 'foo');
      if (existsSync('test-generators/subdir/foo')) {
        throw new Error('The directory "foo" should not exist.');
      }
    });

  });

  describe('has a "ensureFile" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/foo.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/bar.txt');
      rmfile('test-generators/subdir/foo.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should create the file if it does not exist.', () => {
      generator.ensureFile('bar.txt');
      if (!existsSync('test-generators/subdir/bar.txt')) {
        throw new Error('The file "bar.txt" does not exist.');
      }
    });

    it('should not erase the file if it exists.', () => {
      generator.ensureFile('foo.txt');
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'hello'
      );
    });

  });

  describe('has a "copyTemplate" method that', () => {

    const templateDir = join(process.cwd(), 'templates/test-file-system');
    const templatePath = join(process.cwd(), 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should copy the file from the `templates` directory.', () => {
      generator.copyTemplate('test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello'
      );
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        generator.copyTemplate('test-file-system/foobar.txt', 'hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(error.message, 'The template "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "copyTemplateOnlyIf" method that', () => {

    const templateDir = join(process.cwd(), 'templates/test-file-system');
    const templatePath = join(process.cwd(), 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should copy the file if the condition is true.', () => {
      generator.copyTemplateOnlyIf(true, 'test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
    });

    it('should not copy the file if the condition is false.', () => {
      generator.copyTemplateOnlyIf(false, 'test-file-system/tpl.txt', 'hello.txt');
      if (existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" should not exist.');
      }
    });

  });

  describe('has a "render" method that', () => {

    const templateDir = join(process.cwd(), 'templates/test-file-system');
    const templatePath = join(process.cwd(), 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir(templateDir);
      writeFileSync(templatePath, '/* foobar */ /* foobar */ /* barfoo */!', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should copy and render the template from the `templates` directory.', () => {
      generator.render('test-file-system/tpl.txt', 'hello.txt', {
        barfoo: 'world',
        foobar: 'hello',
      });
      if (!existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello hello world!'
      );
    });

    it('should throw an error if the template does not exist.', () => {
      try {
        generator.render('test-file-system/foobar.txt', 'hello.txt', {});
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(error.message, 'The template "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "renderOnlyIf" method that', () => {

    const templateDir = join(process.cwd(), 'templates/test-file-system');
    const templatePath = join(process.cwd(), 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should copy the file if the condition is true.', () => {
      generator.renderOnlyIf(true, 'test-file-system/tpl.txt', 'hello.txt', {});
      if (!existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" does not exist.');
      }
    });

    it('should not copy the file if the condition is false.', () => {
      generator.renderOnlyIf(false, 'test-file-system/tpl.txt', 'hello.txt', {});
      if (existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" should not exist.');
      }
    });

  });

  describe('has a "modify" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
    });

    it('should modify the file with the given callback.', () => {
      generator.modify('hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello world!'
      );
    });

    it('should throw a ClientError if the file does not exist.', () => {
      try {
        generator.modify('test-file-system/foobar.txt', content => content);
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        if (!(error instanceof ClientError)) {
          throw new Error('The error thrown should be an instance of ClientError.');
        }
        strictEqual(error.message, 'Impossible to modify "test-file-system/foobar.txt": the file does not exist.');
      }
    });

  });

  describe('has a "modifyOnlyIf" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should modify the file with the given callback if the condition is true.', () => {
      generator.modifyOnlyfIf(true, 'hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello world!'
      );
    });

    it('should not modify the file with the given callback if the condition is false.', () => {
      generator.modifyOnlyfIf(false, 'hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello'
      );
    });

  });

  describe('has a "addNamedExportIn" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/hello.txt', 'export { foo } from \'foo.txt\';\n', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should add a named import at the bottom of the file.', () => {
      generator.addNamedExportIn('hello.txt', 'bar', 'bar.txt');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'export { foo } from \'foo.txt\';\nexport { bar } from \'bar.txt\';\n'
      );
    });

  });

  describe('has an "addOrExtendNamedImportIn" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync(
        'test-generators/subdir/empty.txt',
        'class FooBar {}',
        'utf8'
      );
      writeFileSync(
        'test-generators/subdir/hello.txt',
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { World } from \'./bar.txt\';\n'
        + '\n'
        + 'class FooBar {}',
        'utf8'
      );
    });

    afterEach(() => {
      rmfile('test-generators/subdir/empty.txt');
      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should add a named import at the beginning of the file if none exists.', () => {
      generator.addOrExtendNamedImportIn('empty.txt', 'FooController', './controllers/foo.controller.txt');
      strictEqual(
        readFileSync('test-generators/subdir/empty.txt', 'utf8'),
        'import { FooController } from \'./controllers/foo.controller.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

    it('should add a named import after all the imports if it does not already exist.', () => {
      generator.addOrExtendNamedImportIn('hello.txt', 'FooController', './controllers/foo.controller.txt');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { World } from \'./bar.txt\';\n'
        + 'import { FooController } from \'./controllers/foo.controller.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

    it('should extend the named import if it already exists and it does not have the specifier.', () => {
      generator.addOrExtendNamedImportIn('hello.txt', 'MyController', './bar.txt');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { MyController, World } from \'./bar.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

    it('should not extend the named import if it already exists but it has already the specifier.', () => {
      generator.addOrExtendNamedImportIn('hello.txt', 'World', './bar.txt');
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { World } from \'./bar.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

  });

  describe('has an "addOrExtendClassArrayProperty" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/foo.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should add the class property if it does not exist (empty class).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '}',
      );
    });

    it('should add the class property if it does not exist (empty class implementing an interface).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar implements IFooBarInterface {}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar implements IFooBarInterface {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '}',
      );
    });

    it('should add the class property if it does not exist (empty class with line returns).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {\n\n}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '}',
      );
    });

    it('should add the class property if it does not exist (class with existing properties).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {\n'
        + '  foo = 3;\n'
        + '  bar() {};\n'
        + '}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '\n'
        + '  foo = 3;\n'
        + '  bar() {};\n'
        + '}',
      );
    });

    it('should extend the class property if it already exists (empty array).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [];\n'
        + '}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'/api\', ApiController)\n'
        + '    ];\n'
        + '}',
      );
    });

    it('should extend the class property if it already exists (empty array with line returns).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '\n'
        + '    ];\n'
        + '}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'/api\', ApiController)\n'
        + '    ];\n'
        + '}',
      );
    });

    it('should extend the class property if it already exists (empty array with existing items).', () => {
      writeFileSync(
        'test-generators/subdir/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'\/foo\', FooController),\n'
        + '        BarController,\n'
        + '    ];\n'
        + '}',
        'utf8'
      );
      generator.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'\/foo\', FooController),\n'
        + '        BarController,\n'
        + '        controller(\'/api\', ApiController)\n'
        + '    ];\n'
        + '}',
      );
    });

  });

  describe('has a "projectHasDependency" method that', () => {

    let initialPkg: Buffer;

    before(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': 'hello',
          'bar': 'world'
        }
      }), 'utf8');
    });

    after(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return true if the project has the dependency in its package.json.', () => {
      strictEqual(generator.projectHasDependency('bar'), true);
    });

    it('should return false if the project does not have the dependency in its package.json.', () => {
      strictEqual(generator.projectHasDependency('foo'), false);
    });

    it('should not change the current working directory.', () => {
      generator.projectHasDependency('commander');
      strictEqual(generator.currentDir, '');
    });

  });

  describe('has a "getProjectDependencies" method that', () => {

    let initialPkg: Buffer;

    before(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': '~1.0.1',
          'bar': '~2.2.0'
        }
      }), 'utf8');
    });

    after(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return the project dependencies.', () => {
      deepStrictEqual(
        generator.getProjectDependencies(),
        [
          { name: '@foal/core', version: '~1.0.1' },
          { name: 'bar', version: '~2.2.0' }
        ]
      );
    });

    it('should not change the current working directory.', () => {
      generator.getProjectDependencies();
      strictEqual(generator.currentDir, '');
    });

  });

  describe('has a "setOrUpdateProjectDependency" method that', () => {

    let initialPkg: Buffer;

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': '~1.0.1',
          'bar': '~2.2.0'
        }
      }), 'utf8');
    });

    afterEach(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return itself.', () => {
      strictEqual(generator.setOrUpdateProjectDependency('foo', '1.0.0'), generator);
    });

    it('should add the dependency if it does not exist.', () => {
      generator.setOrUpdateProjectDependency('foo', '1.0.0');

      const fileContent = readFileSync('package.json', 'utf8');
      const pkg = JSON.parse(fileContent);

      deepStrictEqual(pkg.dependencies, {
        '@foal/core': '~1.0.1',
        'bar': '~2.2.0',
        'foo': '1.0.0'
      });
    });

    it('should update the dependency if it already exists.', () => {
      generator.setOrUpdateProjectDependency('@foal/core', '2.0.0');

      const fileContent = readFileSync('package.json', 'utf8');
      const pkg = JSON.parse(fileContent);

      deepStrictEqual(pkg.dependencies, {
        '@foal/core': '2.0.0',
        'bar': '~2.2.0'
      });

    });

  });

  describe('has a "setOrUpdateProjectDependencyOnlyIf" method that', () => {

    let initialPkg: Buffer;

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': '~1.0.1',
          'bar': '~2.2.0'
        }
      }), 'utf8');
    });

    afterEach(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return itself.', () => {
      strictEqual(generator.setOrUpdateProjectDependency('foo', '1.0.0'), generator);
    });

    context('given the condition is true', () => {
      it('should add the dependency if it does not exist.', () => {
        generator.setOrUpdateProjectDependencyOnlyIf(true, 'foo', '1.0.0');

        const fileContent = readFileSync('package.json', 'utf8');
        const pkg = JSON.parse(fileContent);

        deepStrictEqual(pkg.dependencies, {
          '@foal/core': '~1.0.1',
          'bar': '~2.2.0',
          'foo': '1.0.0'
        });
      });
    });

    context('given the condition is false', () => {
      it('should not add the dependency if it does not exist.', () => {
        generator.setOrUpdateProjectDependencyOnlyIf(false, 'foo', '1.0.0');

        const fileContent = readFileSync('package.json', 'utf8');
        const pkg = JSON.parse(fileContent);

        deepStrictEqual(pkg.dependencies, {
          '@foal/core': '~1.0.1',
          'bar': '~2.2.0'
        });
      });
    });

  });

  describe('has a "getProjectDevDependencies" method that', () => {

    let initialPkg: Buffer;

    before(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': '0.0.0',
        },
        devDependencies: {
          '@foal/cli': '~1.0.1',
          'bar': '~2.2.0'
        }
      }), 'utf8');
    });

    after(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return the project dev dependencies.', () => {
      deepStrictEqual(
        generator.getProjectDevDependencies(),
        [
          { name: '@foal/cli', version: '~1.0.1' },
          { name: 'bar', version: '~2.2.0' }
        ]
      );
    });

    it('should not change the current working directory.', () => {
      generator.getProjectDevDependencies();
      strictEqual(generator.currentDir, '');
    });

  });

  describe('has a "setOrUpdateProjectDevDependency" method that', () => {

    let initialPkg: Buffer;

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      initialPkg = readFileSync('package.json');
      writeFileSync('package.json', JSON.stringify({
        dependencies: {
          '@foal/core': '0.0.1',
        },
        devDependencies: {
          '@foal/cli': '~1.0.1',
          'bar': '~2.2.0'
        }
      }), 'utf8');
    });

    afterEach(() => {
      writeFileSync('package.json', initialPkg);
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should return itself.', () => {
      strictEqual(generator.setOrUpdateProjectDevDependency('foo', '1.0.0'), generator);
    });

    it('should add the dependency if it does not exist.', () => {
      generator.setOrUpdateProjectDevDependency('foo', '1.0.0');

      const fileContent = readFileSync('package.json', 'utf8');
      const pkg = JSON.parse(fileContent);

      deepStrictEqual(pkg.devDependencies, {
        '@foal/cli': '~1.0.1',
        'bar': '~2.2.0',
        'foo': '1.0.0'
      });
    });

    it('should update the dependency if it already exists.', () => {
      generator.setOrUpdateProjectDevDependency('@foal/cli', '2.0.0');

      const fileContent = readFileSync('package.json', 'utf8');
      const pkg = JSON.parse(fileContent);

      deepStrictEqual(pkg.devDependencies, {
        '@foal/cli': '2.0.0',
        'bar': '~2.2.0'
      });

    });

  });

  describe('has an "assetExists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/foo', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/subdir/foo');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        generator.assertExists('bar');
        throw new Error('An error should have been thrown.');
      } catch (error: any) {
        strictEqual(error.message, 'The file "bar" does not exist.');
      }
    });

    it('should not throw an error if the file exits.', () => {
      generator.assertExists('foo');
    });

  });

  describe('has an "assetNotExists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/foo', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/subdir/foo');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should throw an error if the file exits.', () => {
      try {
        generator.assertNotExists('foo');
        throw new Error('An error should have been thrown.');
      } catch (error: any) {
        strictEqual(error.message, 'The file "foo" should not exist.');
      }
    });

    it('should not throw an error if the file does not exist.', () => {
      generator.assertNotExists('bar');
    });

  });

  describe('has an "assertEmptyDir" that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir('test-generators/subdir/foo');
      mkdir('test-generators/subdir/bar');
      writeFileSync('test-generators/subdir/foo/foobar', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/subdir/foo/foobar');
      rmdir('test-generators/subdir/foo');
      rmdir('test-generators/subdir/bar');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should throw an error if the directory is not empty.', () => {
      try {
        generator.assertEmptyDir('foo');
        throw new Error('An error should have been thrown.');
      } catch (error: any) {
        strictEqual(error.message, 'The directory "foo" should be empty.');
      }
    });

    it('should not throw an error if the directory is empty.', () => {
      generator.assertEmptyDir('bar');
    });

  });

  describe('has a "assertEqual" that', () => {

    const specDir = join(process.cwd(), 'specs/test-file-system');
    const specPath = join(process.cwd(), 'specs/test-file-system/foo.spec');
    const stringSpecPath = join(process.cwd(), 'specs/test-file-system/foo.spec.txt');

    beforeEach(() => {
      mkdir(specDir);
      writeFileSync(specPath, Buffer.alloc(3));
      writeFileSync(stringSpecPath, 'hello\nmy\nworld', 'utf8');

      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/foo', Buffer.alloc(3));
      writeFileSync('test-generators/subdir/bar', Buffer.alloc(2));
      writeFileSync('test-generators/subdir/foo.txt', 'hello\nmy\nworld', 'utf8');
      writeFileSync('test-generators/subdir/bar.txt', 'hi\nmy\nearth\n!', 'utf8');
    });

    afterEach(() => {
      rmfile(stringSpecPath);
      rmfile(specPath);
      rmdir(specDir);

      rmfile('test-generators/subdir/foo.txt');
      rmfile('test-generators/subdir/bar.txt');
      rmfile('test-generators/subdir/foo');
      rmfile('test-generators/subdir/bar');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should throw an error if the two files are different (binary).', () => {
      try {
        generator.assertEqual('bar', 'test-file-system/foo.spec');
        throw new Error('An error should have been thrown.');
      } catch (error: any) {
        notStrictEqual(error.message, 'An error should have been thrown.');
      }
    });

    it('should not throw an error if the two files are equal (binary).', () => {
      generator.assertEqual('foo', 'test-file-system/foo.spec');
    });

    it('should throw an error if the two files are different (string).', () => {
      try {
        generator.assertEqual('bar.txt', 'test-file-system/foo.spec.txt');
        throw new Error('An error should have been thrown.');
      } catch (error: any) {
        strictEqual(error.code, 'ERR_ASSERTION');
      }
    });

    it('should not throw an error if the two files are equal (string).', () => {
      generator.assertEqual('foo.txt', 'test-file-system/foo.spec.txt');
    });

    it('should throw an error if the spec file does not exist.', () => {
      try {
        generator.assertEqual('foobar', 'test-file-system/hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(error.message, 'The spec file "test-file-system/hello.txt" does not exist.');
      }
    });

  });

  describe('has a "copyFixture" method that', () => {

    const fixtureDir = join(process.cwd(), 'fixtures/test-file-system');
    const fixturePath = join(process.cwd(), 'fixtures/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      mkdir(fixtureDir);
      writeFileSync(fixturePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(fixturePath);
      rmdir(fixtureDir);

      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should copy the file from the `fixtures` directory.', () => {
      generator.copyFixture('test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "test-generators/subdir/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/subdir/hello.txt', 'utf8'),
        'hello'
      );
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        generator.copyFixture('test-file-system/foobar.txt', 'hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error: any) {
        strictEqual(error.message, 'The fixture file "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "rmfile" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/subdir');
      writeFileSync('test-generators/subdir/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/subdir/hello.txt');
      rmdir('test-generators/subdir');
      rmdir('test-generators');
    });

    it('should remove the file.', () => {
      generator.rmfile('hello.txt');
      if (existsSync('test-generators/subdir/hello.txt')) {
        throw new Error('The file "hello.txt" should have been removed.');
      }
    });
  });

});

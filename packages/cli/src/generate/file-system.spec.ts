// std
import { notStrictEqual, strictEqual } from 'assert';
import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// 3p
import { green, red } from 'colors/safe';

// FoalTS
import { FileSystem } from './file-system';

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

describe('FileSystem', () => {

  let fs: FileSystem;

  beforeEach(() => fs = new FileSystem());

  describe('has a "cd" method that', () => {

    it('should change the current directory.', () => {
      strictEqual(fs.currentDir, '');
      fs.cd('foobar/foo');
      strictEqual(fs.currentDir.replace(/\\/g, '/'), 'foobar/foo');
      fs.cd('../bar');
      strictEqual(fs.currentDir.replace(/\\/g, '/'), 'foobar/bar');
    });

  });

  describe('has a "exists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/foo.txt', Buffer.alloc(3));
    });

    afterEach(() => {
      rmfile('test-generators/foo.txt');
      rmdir('test-generators');
    });

    it('should return true if the file or directory exists.', () => {
      strictEqual(fs.exists('foo.txt'), true);
    });

    it('should return true if the file or directory does not exist.', () => {
      strictEqual(fs.exists('bar.txt'), false);
    });

  });

  describe('has a "ensureDir" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/foo');
    });

    afterEach(() => {
      rmdir('test-generators/foo');
      rmdir('test-generators/bar/foo/foobar');
      rmdir('test-generators/bar/foo');
      rmdir('test-generators/bar');
      rmdir('test-generators');
    });

    it('should create the directory if it does not exist.', () => {
      fs.ensureDir('bar');
      if (!existsSync('test-generators/bar')) {
        throw new Error('The directory "bar" does not exist.');
      }
    });

    it('should not throw if the directory already exists.', () => {
      fs.ensureDir('foo');
    });

    it('should create all intermediate directories.', () => {
      fs.ensureDir('bar/foo/foobar');
      if (!existsSync('test-generators/bar/foo/foobar')) {
        throw new Error('The directory "bar/foo/foobar" does not exist.');
      }
    });

  });

  describe('has a "ensureDirOnlyIf" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
    });

    afterEach(() => {
      rmdir('test-generators/foo');
      rmdir('test-generators');
    });

    it('should create the directory if the condition is true.', () => {
      fs.ensureDirOnlyIf(true, 'foo');
      if (!existsSync('test-generators/foo')) {
        throw new Error('The directory "foo" does not exist.');
      }
    });

    it('should not create the directory if the condition is false.', () => {
      fs.ensureDirOnlyIf(false, 'foo');
      if (existsSync('test-generators/foo')) {
        throw new Error('The directory "foo" should not exist.');
      }
    });

  });

  describe('has a "ensureFile" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/foo.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/bar.txt');
      rmfile('test-generators/foo.txt');
      rmdir('test-generators');
    });

    it('should create the file if it does not exist.', () => {
      fs.ensureFile('bar.txt');
      if (!existsSync('test-generators/bar.txt')) {
        throw new Error('The file "bar.txt" does not exist.');
      }
    });

    it('should not erase the file if it exists.', () => {
      fs.ensureFile('foo.txt');
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
        'hello'
      );
    });

  });

  describe('has a "copy" method that', () => {

    const templateDir = join(__dirname, 'templates/test-file-system');
    const templatePath = join(__dirname, 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should copy the file from the `templates` directory.', () => {
      fs.copy('test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello'
      );
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        fs.copy('test-file-system/foobar.txt', 'hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error) {
        strictEqual(error.message, 'The template "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "copyOnlyIf" method that', () => {

    const templateDir = join(__dirname, 'templates/test-file-system');
    const templatePath = join(__dirname, 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should copy the file if the condition is true.', () => {
      fs.copyOnlyIf(true, 'test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
    });

    it('should not copy the file if the condition is false.', () => {
      fs.copyOnlyIf(false, 'test-file-system/tpl.txt', 'hello.txt');
      if (existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" should not exist.');
      }
    });

  });

  describe('has a "render" method that', () => {

    const templateDir = join(__dirname, 'templates/test-file-system');
    const templatePath = join(__dirname, 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir(templateDir);
      writeFileSync(templatePath, '/* foobar */ /* foobar */ /* barfoo */!', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should copy and render the template from the `templates` directory.', () => {
      fs.render('test-file-system/tpl.txt', 'hello.txt', {
        barfoo: 'world',
        foobar: 'hello',
      });
      if (!existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello hello world!'
      );
    });

    it('should throw an error if the template does not exist.', () => {
      try {
        fs.render('test-file-system/foobar.txt', 'hello.txt', {});
        throw new Error('An error should have been thrown');
      } catch (error) {
        strictEqual(error.message, 'The template "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "renderOnlyIf" method that', () => {

    const templateDir = join(__dirname, 'templates/test-file-system');
    const templatePath = join(__dirname, 'templates/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir(templateDir);
      writeFileSync(templatePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(templatePath);
      rmdir(templateDir);

      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should copy the file if the condition is true.', () => {
      fs.renderOnlyIf(true, 'test-file-system/tpl.txt', 'hello.txt', {});
      if (!existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
    });

    it('should not copy the file if the condition is false.', () => {
      fs.renderOnlyIf(false, 'test-file-system/tpl.txt', 'hello.txt', {});
      if (existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" should not exist.');
      }
    });

  });

  describe('has a "modify" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should modify the file with the given callback.', () => {
      fs.modify('hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello world!'
      );
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        fs.modify('test-file-system/foobar.txt', content => content);
        throw new Error('An error should have been thrown');
      } catch (error) {
        strictEqual(error.message, 'Impossible to modify "test-file-system/foobar.txt": the file does not exist.');
      }
    });

  });

  describe('has a "modifyOnlyIf" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should modify the file with the given callback if the condition is true.', () => {
      fs.modifyOnlyfIf(true, 'hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello world!'
      );
    });

    it('should not modify the file with the given callback if the condition is false.', () => {
      fs.modifyOnlyfIf(false, 'hello.txt', content => content + ' world!');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello'
      );
    });

  });

  describe('has a "addNamedExportIn" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/hello.txt', 'export { foo } from \'foo.txt\';\n', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should add a named import at the bottom of the file.', () => {
      fs.addNamedExportIn('hello.txt', 'bar', 'bar.txt');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'export { foo } from \'foo.txt\';\nexport { bar } from \'bar.txt\';\n'
      );
    });

  });

  describe('has an "addOrExtendNamedImportIn" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync(
        'test-generators/empty.txt',
        'class FooBar {}',
        'utf8'
      );
      writeFileSync(
        'test-generators/hello.txt',
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { World } from \'./bar.txt\';\n'
        + '\n'
        + 'class FooBar {}',
        'utf8'
      );
    });

    afterEach(() => {
      rmfile('test-generators/empty.txt');
      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should add a named import at the beginning of the file if none exists.', () => {
      fs.addOrExtendNamedImportIn('empty.txt', 'FooController', './controllers/foo.controller.txt');
      strictEqual(
        readFileSync('test-generators/empty.txt', 'utf8'),
        'import { FooController } from \'./controllers/foo.controller.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

    it('should add a named import after all the imports if it does not already exist.', () => {
      fs.addOrExtendNamedImportIn('hello.txt', 'FooController', './controllers/foo.controller.txt');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { World } from \'./bar.txt\';\n'
        + 'import { FooController } from \'./controllers/foo.controller.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

    it('should extend the named import if it already exist.', () => {
      fs.addOrExtendNamedImportIn('hello.txt', 'MyController', './bar.txt');
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        '// 3p\n'
        + 'import { Hello } from \'./foo.txt\';\n'
        + 'import { MyController, World } from \'./bar.txt\';\n'
        + '\n'
        + 'class FooBar {}',
      );
    });

  });

  describe('has an "addOrExtendClassArrayProperty" method that should', () => {

    beforeEach(() => {
      mkdir('test-generators');
    });

    afterEach(() => {
      rmfile('test-generators/foo.txt');
      rmdir('test-generators');
    });

    it('should add the class property if it does not exist (empty class).', () => {
      writeFileSync(
        'test-generators/foo.txt',
        'class FooBar {}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '}',
      );
    });

    it('should add the class property if it does not exist (empty class with line returns).', () => {
      writeFileSync(
        'test-generators/foo.txt',
        'class FooBar {\n\n}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '  subControllers = [\n'
        + '    controller(\'/api\', ApiController)\n'
        + '  ];\n'
        + '}',
      );
    });

    it('should add the class property if it does not exist (class with existing properties).', () => {
      writeFileSync(
        'test-generators/foo.txt',
        'class FooBar {\n'
        + '  foo = 3;\n'
        + '  bar() {};\n'
        + '}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
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
        'test-generators/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [];\n'
        + '}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'/api\', ApiController)\n'
        + '    ];\n'
        + '}',
      );
    });

    it('should extend the class property if it already exists (empty array with line returns).', () => {
      writeFileSync(
        'test-generators/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '\n'
        + '    ];\n'
        + '}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'/api\', ApiController)\n'
        + '    ];\n'
        + '}',
      );
    });

    it('should extend the class property if it already exists (empty array with existing items).', () => {
      writeFileSync(
        'test-generators/foo.txt',
        'class FooBar {\n'
        + '    subControllers = [\n'
        + '        controller(\'\/foo\', FooController),\n'
        + '        BarController,\n'
        + '    ];\n'
        + '}',
        'utf8'
      );
      fs.addOrExtendClassArrayPropertyIn(
        'foo.txt',
        'FooBar',
        'subControllers',
        'controller(\'/api\', ApiController)'
      );
      strictEqual(
        readFileSync('test-generators/foo.txt', 'utf8'),
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

  describe('has a "setUp" method that', () => {

    afterEach(() => {
      rmdir('test-generators');
    });

    it('should create the test client directory.', () => {
      fs.setUp();
      if (!existsSync('test-generators')) {
        throw new Error('The directory "test-generators" does not exist.');
      }
    });

    it('should set the current directory to none.', () => {
      fs.cd('foobar');
      fs.setUp();
      strictEqual(fs.currentDir, '');
    });

  });

  describe('has a "tearDown" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/foo');
      writeFileSync('test-generators/foo/bar', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/foo/bar');
      rmdir('test-generators/foo');
      rmdir('test-generators');
    });

    it('should remove the test client directory and all its contents.', () => {
      fs.tearDown();
      if (existsSync('test-generators')) {
        throw new Error('The directory "test-generators" should not exist.');
      }
    });

    it('should set the current directory to none.', () => {
      fs.cd('foobar');
      fs.tearDown();
      strictEqual(fs.currentDir, '');
    });

  });

  describe('has an "assetExists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/foo', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/foo');
      rmdir('test-generators');
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        fs.assertExists('bar');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(error.message, 'The file "bar" does not exist.');
      }
    });

    it('should not throw an error if the file exits.', () => {
      fs.assertExists('foo');
    });

  });

  describe('has an "assetNotExists" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/foo', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/foo');
      rmdir('test-generators');
    });

    it('should throw an error if the file exits.', () => {
      try {
        fs.assertNotExists('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(error.message, 'The file "foo" should not exist.');
      }
    });

    it('should not throw an error if the file does not exist.', () => {
      fs.assertNotExists('bar');
    });

  });

  describe('has an "assertEmptyDir" that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      mkdir('test-generators/foo');
      mkdir('test-generators/bar');
      writeFileSync('test-generators/foo/foobar', Buffer.alloc(2));
    });

    afterEach(() => {
      rmfile('test-generators/foo/foobar');
      rmdir('test-generators/foo');
      rmdir('test-generators/bar');
      rmdir('test-generators');
    });

    it('should throw an error if the directory is not empty.', () => {
      try {
        fs.assertEmptyDir('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(error.message, 'The directory "foo" should be empty.');
      }
    });

    it('should not throw an error if the directory is empty.', () => {
      fs.assertEmptyDir('bar');
    });

  });

  describe('has a "assertEqual" that', () => {

    const specDir = join(__dirname, 'specs/test-file-system');
    const specPath = join(__dirname, 'specs/test-file-system/foo.spec');
    const stringSpecPath = join(__dirname, 'specs/test-file-system/foo.spec.txt');

    beforeEach(() => {
      mkdir(specDir);
      writeFileSync(specPath, Buffer.alloc(3));
      writeFileSync(stringSpecPath, 'hello\nmy\nworld', 'utf8');

      mkdir('test-generators');
      writeFileSync('test-generators/foo', Buffer.alloc(3));
      writeFileSync('test-generators/bar', Buffer.alloc(2));
      writeFileSync('test-generators/foo.txt', 'hello\nmy\nworld', 'utf8');
      writeFileSync('test-generators/bar.txt', 'hi\nmy\nearth\n!', 'utf8');
    });

    afterEach(() => {
      rmfile(stringSpecPath);
      rmfile(specPath);
      rmdir(specDir);

      rmfile('test-generators/foo.txt');
      rmfile('test-generators/bar.txt');
      rmfile('test-generators/foo');
      rmfile('test-generators/bar');
      rmdir('test-generators');
    });

    it('should throw an error if the two files are different (binary).', () => {
      try {
        fs.assertEqual('bar', 'test-file-system/foo.spec');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        notStrictEqual(error.message, 'An error should have been thrown.');
      }
    });

    it('should not throw an error if the two files are equal (binary).', () => {
      fs.assertEqual('foo', 'test-file-system/foo.spec');
    });

    it('should throw an error if the two files are different (string).', () => {
      try {
        fs.assertEqual('bar.txt', 'test-file-system/foo.spec.txt');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        notStrictEqual(error.message, 'An error should have been thrown.');
      }
    });

    it('should not throw an error if the two files are equal (string).', () => {
      fs.assertEqual('foo.txt', 'test-file-system/foo.spec.txt');
    });

    it('should throw an error if the spec file does not exist.', () => {
      try {
        fs.assertEqual('foobar', 'test-file-system/hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error) {
        strictEqual(error.message, 'The spec file "test-file-system/hello.txt" does not exist.');
      }
    });

    it('should throw understandable errors.', () => {
      try {
        fs.assertEqual('bar.txt', 'test-file-system/foo.spec.txt');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          `The two files "bar.txt" and "test-file-system/foo.spec.txt" are not equal.\n\n`
          + 'Line 1\n'
          + green(' Expected: hello\n')
          + red(' Actual: hi')
          + '\n\n'
          + 'Line 3\n'
          + green(' Expected: world\n')
          + red(' Actual: earth')
          + '\n\n'
          + 'Line 4\n'
          + green(' Expected: undefined\n')
          + red(' Actual: !')
        );
      }
    });

  });

  describe('has a "copyFixture" method that', () => {

    const fixtureDir = join(__dirname, 'fixtures/test-file-system');
    const fixturePath = join(__dirname, 'fixtures/test-file-system/tpl.txt');

    beforeEach(() => {
      mkdir('test-generators');
      mkdir(fixtureDir);
      writeFileSync(fixturePath, 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile(fixturePath);
      rmdir(fixtureDir);

      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should copy the file from the `fixtures` directory.', () => {
      fs.copyFixture('test-file-system/tpl.txt', 'hello.txt');
      if (!existsSync('test-generators/hello.txt')) {
        throw new Error('The file "test-generators/hello.txt" does not exist.');
      }
      strictEqual(
        readFileSync('test-generators/hello.txt', 'utf8'),
        'hello'
      );
    });

    it('should throw an error if the file does not exist.', () => {
      try {
        fs.copyFixture('test-file-system/foobar.txt', 'hello.txt');
        throw new Error('An error should have been thrown');
      } catch (error) {
        strictEqual(error.message, 'The fixture file "test-file-system/foobar.txt" does not exist.');
      }
    });

  });

  describe('has a "rmfile" method that', () => {

    beforeEach(() => {
      mkdir('test-generators');
      writeFileSync('test-generators/hello.txt', 'hello', 'utf8');
    });

    afterEach(() => {
      rmfile('test-generators/hello.txt');
      rmdir('test-generators');
    });

    it('should remove the file.', () => {
      fs.rmfile('hello.txt');
      if (existsSync('test-generators/hello.txt')) {
        throw new Error('The file "hello.txt" should have been removed.');
      }
    });
  });

});

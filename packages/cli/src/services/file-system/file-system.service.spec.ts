import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { FileSystemService } from './file-system.service';
import { doesNotThrow, strictEqual, throws } from 'assert';

function setUpTestDirectory(): void {
  mkdirSync('test-generators/subdir', { recursive: true });
}

function tearDownTestDirectory(): void {
  rmSync('test-generators', { recursive: true, force: true });
}

describe('FileSystemService', () => {
  let fileSystem: FileSystemService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
  });

  describe('has a "setUp" method that', () => {
    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should create the test directory', () => {
      strictEqual(existsSync('test-generators/subdir'), false);

      fileSystem.setUp();

      strictEqual(existsSync('test-generators/subdir'), true);
    });
  });

  describe('has a "tearDown" method that', () => {
    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should remove the test directory if it is empty', () => {
      setUpTestDirectory();

      strictEqual(existsSync('test-generators/subdir'), true);

      fileSystem.tearDown();

      strictEqual(existsSync('test-generators/subdir'), false);
    });

    it('should remove the test directory if it is not empty', () => {
      setUpTestDirectory();

      mkdirSync('test-generators/subdir/foo');

      strictEqual(existsSync('test-generators/subdir'), true);

      fileSystem.tearDown();

      strictEqual(existsSync('test-generators/subdir'), false);
    });

    it('should not throw if the test directory does not exist', () => {
      doesNotThrow(() => {
        fileSystem.tearDown();
      });
    });
  });

  describe('has a "computePath" method that', () => {
    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should throw an error if test directory does not exist in a testing environment', () => {
      throws(() => {
        fileSystem.computePath('foo/bar');
      }, /The testing environment is not set up./);
    });

    it('should return the path prefixed with the test directory in a testing environment', () => {
      setUpTestDirectory();

      strictEqual(
        fileSystem.computePath('foo/bar'),
        'test-generators/subdir/foo/bar'
      );
    });
  });

  describe('has a "mkdir" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should create the directory', () => {
      strictEqual(existsSync('test-generators/subdir/foo'), false);

      fileSystem.mkdir('foo');

      strictEqual(existsSync('test-generators/subdir/foo'), true);
    });

    it('should create the directory and all its parent directories', () => {
      strictEqual(existsSync('test-generators/subdir/foo/bar'), false);

      fileSystem.mkdir('foo/bar');

      strictEqual(existsSync('test-generators/subdir/foo/bar'), true);
    });
  });

  describe('has a "rmdir" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should remove the directory if it is empty', () => {
      mkdirSync('test-generators/subdir/foo');

      strictEqual(existsSync('test-generators/subdir/foo'), true);

      fileSystem.rmdir('foo');

      strictEqual(existsSync('test-generators/subdir/foo'), false);
    });

    it('should remove the directory if it is not empty', () => {
      mkdirSync('test-generators/subdir/foo/bar', { recursive: true });

      strictEqual(existsSync('test-generators/subdir/foo/bar'), true);

      fileSystem.rmdir('foo');

      strictEqual(existsSync('test-generators/subdir/foo'), false);
    });
  });

  describe('has a "writeFile" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should write the file', () => {
      strictEqual(existsSync('test-generators/subdir/foo.txt'), false);

      fileSystem.writeFile('foo.txt', 'hello');

      strictEqual(existsSync('test-generators/subdir/foo.txt'), true);
      strictEqual(readFileSync('test-generators/subdir/foo.txt', 'utf8'), 'hello');
    });
  });

  describe('has a "readFile" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should read the file', () => {
      writeFileSync('test-generators/subdir/foo.txt', 'hello');

      strictEqual(fileSystem.readFile('foo.txt'), 'hello');
    });
  });

  describe('has a "readFileFromTemplates" method that', () => {
    it('should read the file from the templates directory', () => {
      const content = fileSystem.readFileFromTemplates('file-system/test-template.txt');

      strictEqual(content, 'This is a template to test the FileSystem service.');
    });
  });

  describe('has a "deleteFile" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should delete the file', () => {
      writeFileSync('test-generators/subdir/foo.txt', 'hello');

      strictEqual(existsSync('test-generators/subdir/foo.txt'), true);

      fileSystem.deleteFile('foo.txt');

      strictEqual(existsSync('test-generators/subdir/foo.txt'), false);
    });
  });

  describe('has a "copyFile" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should copy the file', () => {
      writeFileSync('test-generators/subdir/foo.txt', 'hello');

      fileSystem.copyFile('foo.txt', 'bar.txt');

      strictEqual(existsSync('test-generators/subdir/bar.txt'), true);
      strictEqual(readFileSync('test-generators/subdir/bar.txt', 'utf8'), 'hello');
    });
  });

  describe('has a "copyFileFromTemplates" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should copy the file from the templates directory', () => {
      fileSystem.copyFileFromTemplates(
        'file-system/test-template.txt',
        'foo.txt'
      );

      strictEqual(existsSync('test-generators/subdir/foo.txt'), true);
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'This is a template to test the FileSystem service.'
      );
    });
  });

  describe('has a "copyFileFromFixtures" method that', () => {
    beforeEach(() => {
      setUpTestDirectory();
    });

    afterEach(() => {
      tearDownTestDirectory();
    });

    it('should copy the file from the fixtures directory', () => {
      fileSystem.copyFileFromFixtures(
        'file-system/test-fixture.txt',
        'foo.txt'
      );

      strictEqual(existsSync('test-generators/subdir/foo.txt'), true);
      strictEqual(
        readFileSync('test-generators/subdir/foo.txt', 'utf8'),
        'This is a fixture to test the FileSystem service.'
      );
    });
  });
});
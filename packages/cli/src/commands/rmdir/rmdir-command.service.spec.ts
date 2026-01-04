// std
import { strictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';

// FoalTS
import { RmdirCommandService } from './rmdir-command.service';

describe('RmdirCommandService', () => {
  let service: RmdirCommandService;

  beforeEach(() => {
    service = new RmdirCommandService();
    mkdirSync('temp-test');
    writeFileSync('temp-test/foo.txt', 'foo', 'utf8');
    writeFileSync('temp-test/bar.txt', 'bar', 'utf8');
    mkdirSync('temp-test/foobar');
    writeFileSync('temp-test/foobar/foo.txt', 'foo', 'utf8');
    writeFileSync('temp-test/foobar/bar.txt', 'bar', 'utf8');
    mkdirSync('temp-test/barfoo');
  });

  afterEach(() => {
    if (existsSync('temp-test/barfoo')) { rmdirSync('temp-test/barfoo'); }
    if (existsSync('temp-test/foobar/bar.txt')) { unlinkSync('temp-test/foobar/bar.txt'); }
    if (existsSync('temp-test/foobar/foo.txt')) { unlinkSync('temp-test/foobar/foo.txt'); }
    if (existsSync('temp-test/foobar')) { rmdirSync('temp-test/foobar'); }
    if (existsSync('temp-test/bar.txt')) { unlinkSync('temp-test/bar.txt'); }
    if (existsSync('temp-test/foo.txt')) { unlinkSync('temp-test/foo.txt'); }
    if (existsSync('temp-test')) { rmdirSync('temp-test'); }
  });

  describe('has a "run" method that', () => {
    it('should not throw if the directory at the given path does not exist.', async () => {
      await service.run('does-not-exist');
    });

    it('should throw an Error if the given path is not the path of a directory.', async () => {
      try {
        await service.run('package.json');
        throw new Error('run should have thrown an Error.');
      } catch (error: any) {
        strictEqual(error.code, 'ENOTDIR');
      }
    });

    it('should remove the directory when it is empty.', async () => {
      strictEqual(existsSync('temp-test/barfoo'), true);
      await service.run('temp-test/barfoo');
      strictEqual(existsSync('temp-test/barfoo'), false);
    });

    it('should remove the directory when it is not empty.', async () => {
      strictEqual(existsSync('temp-test'), true);
      await service.run('temp-test');
      strictEqual(existsSync('temp-test'), false);
    });
  });
});


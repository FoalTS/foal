// std
import { strictEqual } from 'assert';

// 3p
import { ConfigNotFoundError, ConfigTypeError, createService } from '@foal/core';

// FoalTS
import { Disk } from './disk.service';

describe('Disk', () => {

  let disk: Disk;

  beforeEach(() => {
    disk = createService(Disk);
  });

  afterEach(() => {
    delete process.env.SETTINGS_DISK_DRIVER;
  });

  describe('has a "write" method that', () => {

    it('should throw an Error if no driver is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_DRIVER;
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.driver');
        strictEqual(error.msg, 'You must provide a driver name when using file storage (Disk).');
      }
    });

    it('should call LocalDisk.write if the driver is "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.local.directory');
      }
    });

    it('should call ConcreteDisk.write of the driver package if the driver is not "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/internal-test';
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'internal-test package: write called'
        );
      }
    });

    it('should throw an Error if the driver does not export a ConcreteDisk.', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/core';
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          '"@foal/core" is not a valid driver. Cannot find the "ConcreteClass" export.'
        );
      }
    });

    it('should throw an Error if the driver does not exist.', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'foo';
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'Cannot find module \'foo\''
        );
      }
    });

  });

  describe('has a "read" method that', () => {

    it('should throw an Error if no driver is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_DRIVER;
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.driver');
        strictEqual(error.msg, 'You must provide a driver name when using file storage (Disk).');
      }
    });

    it('should call LocalDisk.read if the driver is "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.local.directory');
      }
    });

    it('should call ConcreteDisk.read of the driver package if the driver is not "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/internal-test';
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'internal-test package: read called'
        );
      }
    });

    it('should throw an Error if the driver does not export a ConcreteDisk.', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/core';
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          '"@foal/core" is not a valid driver. Cannot find the "ConcreteClass" export.'
        );
      }
    });

    it('should throw an Error if the driver does not exist.', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'foo';
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'Cannot find module \'foo\''
        );
      }
    });

  });

  describe('has a "delete" method that', () => {

    it('should throw an Error if no driver is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_DRIVER;
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.driver');
        strictEqual(error.msg, 'You must provide a driver name when using file storage (Disk).');
      }
    });

    it('should call LocalDisk.delete if the driver is "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.disk.local.directory');
      }
    });

    it('should call ConcreteDisk.delete of the driver package if the driver is not "local".', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/internal-test';
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'internal-test package: delete called'
        );
      }
    });

    it('should throw an Error if the driver does not export a ConcreteDisk.', async () => {
      process.env.SETTINGS_DISK_DRIVER = '@foal/core';
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          '"@foal/core" is not a valid driver. Cannot find the "ConcreteClass" export.'
        );
      }
    });

    it('should throw an Error if the driver does not exist.', async () => {
      process.env.SETTINGS_DISK_DRIVER = 'foo';
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'Cannot find module \'foo\''
        );
      }
    });

  });

});

// std
import { notStrictEqual, strictEqual } from 'assert';
import { pbkdf2Sync } from 'crypto';

// FoalTS
import { ServiceManager } from '../../../core';
import { PASSWORD_ITERATIONS, PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    const serviceManager = new ServiceManager();
    service = serviceManager.get(PasswordService);
  });

  describe('has a "hashPassword" method that', () => {
    it('should hash the plain password into a 32-byte derived key with PBKDF2/SHA256,'
        + ' 600,000 iterations and a 16-byte random salt.', async () => {
      const plainPassword = 'hello world';
      const actual = await service.hashPassword(plainPassword);

      const [ algorithm, iterations, salt, derivedKey ] = actual.split('$');

      strictEqual(algorithm, 'pbkdf2_sha256');
      strictEqual(parseInt(iterations, 10), 600000);
      strictEqual(Buffer.from(salt, 'base64').length, 16);
      strictEqual(Buffer.from(derivedKey, 'base64').length, 32);

      const expectedBuffer = await pbkdf2Sync(plainPassword, Buffer.from(salt, 'base64'), 600000, 32, 'sha256');

      strictEqual(derivedKey, expectedBuffer.toString('base64'));
    });
  });

  describe('has a "verifyPassword" method that', () => {
    it('should verify passwords based on the specified algorithm, iterations and salt.', async () => {
      const plainPassword = 'hello world';

      const saltBuffer = Buffer.from('aaa', 'base64');
      const iterations = 3;
      const keylen = 4;
      const derivedKey = pbkdf2Sync(plainPassword, saltBuffer, iterations, keylen, 'sha256');
      const passwordHash = `pbkdf2_sha256$3$aaa$${derivedKey.toString('base64')}`;

      strictEqual(await service.verifyPassword(plainPassword, passwordHash), true);
      strictEqual(await service.verifyPassword('wrong password', passwordHash), false);
    });

    it('should verify password hashes created from hashPassword.', async () => {
      const plainPassword = 'hello world';
      const passwordHash = await service.hashPassword(plainPassword);

      strictEqual(await service.verifyPassword(plainPassword, passwordHash), true);
      strictEqual(await service.verifyPassword('wrong password', passwordHash), false);
    });

    context('given options with "onPasswordUpgrade" callback is provided', () => {
      function createOutdatedPasswordHash(plainPassword: string): string {
        const outdatedIterations = PASSWORD_ITERATIONS - 1;
        const saltBuffer = Buffer.from('aaa', 'base64');
        const keylen = 4;
        const derivedKey = pbkdf2Sync(plainPassword, saltBuffer, outdatedIterations, keylen, 'sha256');
        return `pbkdf2_sha256$${outdatedIterations}$aaa$${derivedKey.toString('base64')}`;
      }

      it('should call the callback with a new hash when the password is valid and the hash needs to be refreshed.', async () => {
        const plainPassword = 'hello world';
        const outdatedPasswordHash = createOutdatedPasswordHash(plainPassword);

        let onPasswordUpgradeCalled = false;
        let newHashReceived: string | undefined;

        const onPasswordUpgrade = async (newHash: string) => {
          onPasswordUpgradeCalled = true;
          newHashReceived = newHash;
        };

        const isValid = await service.verifyPassword(plainPassword, outdatedPasswordHash, { onPasswordUpgrade });

        strictEqual(isValid, true);
        strictEqual(onPasswordUpgradeCalled, true);
        notStrictEqual(newHashReceived, undefined);
        strictEqual(newHashReceived?.startsWith('pbkdf2_sha256$'), true);
        strictEqual(newHashReceived?.includes(`${PASSWORD_ITERATIONS}$`), true);
      });

      it('should NOT call the callback when the password is invalid.', async () => {
        const plainPassword = 'hello world';
        const outdatedPasswordHash = createOutdatedPasswordHash(plainPassword);

        let onPasswordUpgradeCalled = false;

        const onPasswordUpgrade = async (newHash: string) => {
          onPasswordUpgradeCalled = true;
        };

        const isValid = await service.verifyPassword('wrong password', outdatedPasswordHash, { onPasswordUpgrade });

        strictEqual(isValid, false);
        strictEqual(onPasswordUpgradeCalled, false);
      });

      it('should NOT call the callback when the password is valid but the hash does NOT need to be refreshed.', async () => {
        const plainPassword = 'hello world';
        const passwordHash = await service.hashPassword(plainPassword);

        let onPasswordUpgradeCalled = false;

        const onPasswordUpgrade = async (newHash: string) => {
          onPasswordUpgradeCalled = true;
        };

        const isValid = await service.verifyPassword(plainPassword, passwordHash, { onPasswordUpgrade });

        strictEqual(isValid, true);
        strictEqual(onPasswordUpgradeCalled, false);
      });

      it('should work with a synchronous callback.', async () => {
        const plainPassword = 'hello world';
        const outdatedPasswordHash = createOutdatedPasswordHash(plainPassword);

        let onPasswordUpgradeCalled = false;
        let newHashReceived: string | undefined;

        const onPasswordUpgrade = (newHash: string) => {
          onPasswordUpgradeCalled = true;
          newHashReceived = newHash;
        };

        const isValid = await service.verifyPassword(plainPassword, outdatedPasswordHash, { onPasswordUpgrade });

        strictEqual(isValid, true);
        strictEqual(onPasswordUpgradeCalled, true);
        notStrictEqual(newHashReceived, undefined);
      });
    });
  });

  describe('has a "passwordHashNeedsToBeRefreshed" method that', () => {
    function createPasswordHash(iterations: number): string {
      return `pbkdf2_sha256$${iterations}$salt$derivedKey`;
    }

    it('should return true if the number of iterations of the password hash is less than the current number of iterations of "hashPassword".', () => {
      const passwordHash = createPasswordHash(PASSWORD_ITERATIONS - 1);
      strictEqual(service.passwordHashNeedsToBeRefreshed(passwordHash), true);
    });

    it('should return false if the number of iterations of the password hash is greater than the current number of iterations of "hashPassword".', () => {
      const passwordHash = createPasswordHash(PASSWORD_ITERATIONS + 1);
      strictEqual(service.passwordHashNeedsToBeRefreshed(passwordHash), false);
    });

    it('should return false if the number of iterations of the password hash is equal to the current number of iterations of "hashPassword".', () => {
      const passwordHash = createPasswordHash(PASSWORD_ITERATIONS);
      strictEqual(service.passwordHashNeedsToBeRefreshed(passwordHash), false);
    });
  });
});


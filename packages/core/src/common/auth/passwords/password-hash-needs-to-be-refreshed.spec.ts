// std
import { strictEqual } from 'assert';

// FoalTS
import { PASSWORD_ITERATIONS } from './hash-password';
import { passwordHashNeedsToBeRefreshed } from './password-hash-needs-to-be-refreshed';

describe('passwordHashNeedsToBeRefreshed', () => {
  function createPasswordHash(iterations: number): string {
    return `pbkdf2_sha256$${iterations}$salt$derivedKey`;
  }

  it('should return true if the number of iterations of the password hash is less than the current number of iterations of "hashPassword".', () => {
    const passwordHash = createPasswordHash(PASSWORD_ITERATIONS - 1);
    strictEqual(passwordHashNeedsToBeRefreshed(passwordHash), true);
  });
  it('should return false if the number of iterations of the password hash is greater than the current number of iterations of "hashPassword".', () => {
    const passwordHash = createPasswordHash(PASSWORD_ITERATIONS + 1);
    strictEqual(passwordHashNeedsToBeRefreshed(passwordHash), false);
  });
  it('should return false if the number of iterations of the password hash is equal to the current number of iterations of "hashPassword".', () => {
    const passwordHash = createPasswordHash(PASSWORD_ITERATIONS);
    strictEqual(passwordHashNeedsToBeRefreshed(passwordHash), false);
  });
});
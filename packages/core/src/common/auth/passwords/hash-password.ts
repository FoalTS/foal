import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

export const PASSWORD_ITERATIONS = 600000;

/**
 * Hash a password using the PBKDF2 algorithm.
 *
 * Configured to use PBKDF2 + HMAC + SHA256.
 * The result is a 64 byte binary string.
 *
 * The random salt is 16 bytes long.
 * The number of iterations is 600,000.
 * The length key is 32 bytes long.
 *
 * @export
 * @param {string} plainTextPassword - The password to hash.
 * @returns {Promise<string>} The derived key with the algorithm name, the number of iterations and the salt.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltBuffer = await promisify(randomBytes)(16);
  const iterations = PASSWORD_ITERATIONS;
  const keylen = 32;
  const digest = 'sha256';
  const derivedKeyBuffer = await promisify(pbkdf2)(plainTextPassword, saltBuffer, iterations, keylen, digest);

  const salt = saltBuffer.toString('base64');
  const derivedKey = derivedKeyBuffer.toString('base64');
  return `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey}`;
}

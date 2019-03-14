import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

/**
 * Legacy function to encrypt passwords. Only kept for backward compatibility.
 * @param password
 */
async function parsePassword(password: string): Promise<string> {
  const salt = (await promisify(randomBytes)(16)).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  const derivedKey = await promisify(pbkdf2)(password, salt, iterations, keylen, digest);
  return `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Hash a password using the PBKDF2 algorithm.
 *
 * Configured to use PBKDF2 + HMAC + SHA256.
 * The result is a 64 byte binary string (or hex if the legacy option is true).
 *
 * The random salt is 16 bytes long.
 * The number of iterations is 150000.
 * The length key is 32 bytes long.
 *
 * @export
 * @param {string} plainTextPassword - The password to encrypt.
 * @param {{ legacy?: boolean }} [options={}]
 * @returns {Promise<string>} The derived key with the algorithm name, the number of iterations and the salt.
 */
export async function encryptPassword(plainTextPassword: string,
                                      options: { legacy?: boolean } = {}): Promise<string> {
  if (options.legacy) {
    return parsePassword(plainTextPassword);
  }
  const saltBuffer = await promisify(randomBytes)(16);
  const iterations = 150000;
  const keylen = 32;
  const digest = 'sha256';
  const derivedKeyBuffer = await promisify(pbkdf2)(plainTextPassword, saltBuffer, iterations, keylen, digest);

  const salt = saltBuffer.toString('base64');
  const derivedKey = derivedKeyBuffer.toString('base64');
  return `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey}`;
}

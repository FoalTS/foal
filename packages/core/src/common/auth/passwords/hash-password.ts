import { PasswordService } from './password.service';

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
 * @deprecated Use `PasswordService.hashPassword()` instead.
 * @export
 * @param {string} plainTextPassword - The password to hash.
 * @returns {Promise<string>} The derived key with the algorithm name, the number of iterations and the salt.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const service = new PasswordService();
  return service.hashPassword(plainTextPassword);
}

import { randomBytes } from 'crypto';
import { promisify } from 'util';

/**
 * Create a random 256-bit secret encoded in base64.
 *
 * @export
 * @returns {Promise<string>} The base64 string.
 */
export async function createSecret(): Promise<string> {
  const buff = await promisify(randomBytes)(32);
  return buff.toString('base64');
}

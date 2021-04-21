// std
import { randomBytes } from 'crypto';
import { promisify } from 'util';

// FoalTS
import { convertBase64ToBase64url } from '../encoding';

/**
 * Generate a 256-bit base64url-encoded token.
 *
 * @export
 * @returns {Promise<string>} The generated token.
 */
export async function generateToken(): Promise<string> {
  const buff = await promisify(randomBytes)(32);
  return convertBase64ToBase64url(buff.toString('base64'));
}

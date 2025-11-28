import { randomBytes } from 'crypto';
import { promisify } from 'util';

/**
 * Service for cryptographic operations.
 */
export class CryptoService {
  /**
   * Create a random 256-bit secret encoded in base64.
   *
   * @returns {Promise<string>} The base64 string.
   */
  async createSecret(): Promise<string> {
    const buff = await promisify(randomBytes)(32);
    return buff.toString('base64');
  }
}


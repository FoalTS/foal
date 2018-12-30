import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

export async function encryptPassword(plainTextPassword: string,
                                      options: { encoding?: 'hex'|'base64' } = {}): Promise<string> {
  const saltBuffer = await promisify(randomBytes)(16);
  const iterations = 150000;
  const keylen = 32;
  const digest = 'sha256';
  const derivedKeyBuffer = await promisify(pbkdf2)(plainTextPassword, saltBuffer, iterations, keylen, digest);

  const salt = saltBuffer.toString(options.encoding || 'base64');
  const derivedKey = derivedKeyBuffer.toString(options.encoding || 'base64');
  return `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey}`;
}

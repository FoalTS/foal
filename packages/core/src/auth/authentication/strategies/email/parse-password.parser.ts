import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

export async function parsePassword(data: { password?: string }): Promise<void> {
  if (!data.password) {
    return;
  }
  const salt = (await promisify(randomBytes)(16)).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  const derivedKey = await promisify(pbkdf2)(data.password, salt, iterations, keylen, digest);
  data.password = `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey.toString('hex')}`;
}

import { strictEqual } from 'assert';
import { pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

export async function verifyPassword(plainTextPassword: string, encryptedPassword: string,
                                     options: { legacy?: boolean } = {}): Promise<boolean> {
  const legacy = options.legacy || false;
  const [ algorithm, iterations, salt, derivedKey ] = encryptedPassword.split('$');

  strictEqual(algorithm, 'pbkdf2_sha256', 'Invalid algorithm.');

  strictEqual(typeof iterations, 'string', 'Invalid password format.');
  strictEqual(typeof salt, 'string', 'Invalid password format.');
  strictEqual(typeof derivedKey, 'string', 'Invalid password format.');
  strictEqual(isNaN(parseInt(iterations, 10)), false, 'Invalid password format.');

  const saltBuffer = Buffer.from(salt, legacy ? 'hex' : 'base64');
  const derivedKeyBuffer = Buffer.from(derivedKey, legacy ? 'hex' : 'base64');
  const digest = 'sha256'; // TODO: depends on the algorthim var
  const password = await promisify(pbkdf2)(
    plainTextPassword,
    legacy ? saltBuffer.toString('hex') : saltBuffer,
    parseInt(iterations, 10),
    derivedKeyBuffer.length,
    digest
  );
  return timingSafeEqual(password, derivedKeyBuffer);
}

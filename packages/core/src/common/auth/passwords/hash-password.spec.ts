// std
import { strictEqual } from 'assert';
import { pbkdf2Sync } from 'crypto';

// FoalTS
import { hashPassword } from './hash-password';

describe('hashPassword', () => {

  it('should hash the plain password into a 32-byte derived key with PBKDF2/SHA256,'
      + ' 600,000 iterations and a 16-byte random salt.', async () => {
    const plainPassword = 'hello world';
    const actual = await hashPassword(plainPassword);

    const [ algorithm, iterations, salt, derivedKey ] = actual.split('$');

    strictEqual(algorithm, 'pbkdf2_sha256');
    strictEqual(parseInt(iterations, 10), 600000);
    strictEqual(Buffer.from(salt, 'base64').length, 16);
    strictEqual(Buffer.from(derivedKey, 'base64').length, 32);

    const expectedBuffer = await pbkdf2Sync(plainPassword, Buffer.from(salt, 'base64'), 600000, 32, 'sha256');

    strictEqual(derivedKey, expectedBuffer.toString('base64'));
  });

});

// std
import { fail, ok, strictEqual } from 'assert';
import { pbkdf2Sync } from 'crypto';

// FoalTS
import { hashPassword } from './hash-password';
import { verifyPassword } from './verify-password';

describe('verifyPassword', () => {

  it('should verify passwords based on the specified algorithm, iterations and salt.', async () => {
    const plainPassword = 'hello world';

    const saltBuffer = Buffer.from('aaa', 'base64');
    const iterations = 3;
    const keylen = 4;
    const derivedKey = pbkdf2Sync(plainPassword, saltBuffer, iterations, keylen, 'sha256');
    const passwordHash = `pbkdf2_sha256$3$aaa$${derivedKey.toString('base64')}`;

    ok(await verifyPassword(plainPassword, passwordHash));
    strictEqual(await verifyPassword('wrong password', passwordHash), false);
  });

  it('should verify password hashes created from hashPassword.', async () => {
    const plainPassword = 'hello world';
    const passwordHash = await hashPassword(plainPassword);

    ok(await verifyPassword(plainPassword, passwordHash));
    strictEqual(await verifyPassword('wrong password', passwordHash), false);
  });

});

// std
import { ok, strictEqual } from 'assert';
import { pbkdf2Sync } from 'crypto';

// FoalTS
import { encryptPassword } from './encrypt-password.util';
import { verifyPassword } from './verify-password.util';

// should reject an error if the encrypted password format is invalid
// algorithm, parseInt

describe('verifyPassword', () => {

  it('should reject an Error if the encrypted password format is invalid.', () => {

  });

  it('should verify passwords based on the specified algorithm, iterations and salt.', async () => {
    const plainPassword = 'hello world';

    const saltBuffer = Buffer.from('aaa', 'base64');
    const iterations = 3;
    const keylen = 4;
    const derivedKey = pbkdf2Sync(plainPassword, saltBuffer, iterations, keylen, 'sha256');
    const encryptedPassword = `pbkdf2_sha256$3$aaa$${derivedKey.toString('base64')}`;

    ok(await verifyPassword(plainPassword, encryptedPassword));
    strictEqual(await verifyPassword('wrong password', encryptedPassword), false);
  });

  it('should verify passwords encrypted with encryptPassword.', async () => {
    const plainPassword = 'hello world';
    const encryptedPassword = await encryptPassword(plainPassword);

    ok(await verifyPassword(plainPassword, encryptedPassword));
    strictEqual(await verifyPassword('wrong password', encryptedPassword), false);
  });

  it('should verify passwords encrypted with encryptPassword and the legacy option (old parsePassword).', async () => {
    const plainPassword = 'hello world';
    const encryptedPassword = await encryptPassword(plainPassword, { legacy: true });

    ok(await verifyPassword(plainPassword, encryptedPassword, { legacy: true }));
    strictEqual(await verifyPassword('wrong password', encryptedPassword, { legacy: true }), false);
  });

});

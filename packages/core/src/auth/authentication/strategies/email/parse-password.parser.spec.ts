// std
import { strictEqual } from 'assert';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

// FoalTS
import { parsePassword } from './parse-password.parser';

describe('parsePassword', () => {

  it('should hash and salt the plain password if it exists.', async () => {
    const actual = await parsePassword('my_strong_password');
    strictEqual(typeof actual, 'string');
    const arr = actual.split('$');
    strictEqual(arr.length, 4);
    const password = {
      algorithm: arr[0],
      derivedKey: arr[3],
      iterations: parseInt(arr[1], 10),
      salt: arr[2],
    };
    strictEqual(password.algorithm, 'pbkdf2_sha256');
    strictEqual(password.iterations, 100000);
    strictEqual(password.salt.length, 32);
    strictEqual(password.derivedKey.length, 128);

    const derivedKey = await promisify(pbkdf2)(
      'my_strong_password', password.salt, password.iterations, 64, 'sha256'
    );
    strictEqual(derivedKey.toString('hex'), password.derivedKey);
  });

});

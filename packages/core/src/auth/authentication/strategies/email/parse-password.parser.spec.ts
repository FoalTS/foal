import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

import { expect } from 'chai';
import { parsePassword } from './parse-password.parser';

describe('parsePassword', () => {

  it('should not throw an exception or add a password property to the data if it originally'
      + 'does not exist.', async () => {
    const user = {};
    await parsePassword(user);
    expect(user.hasOwnProperty('password')).to.equal(false);
  });

  it('should hash and salt the plain password if it exists.', async () => {
    const user = {
      password: 'my_strong_password'
    };
    await parsePassword(user);
    expect(user.password).to.be.an('string');
    const arr = user.password.split('$');
    expect(arr).to.have.lengthOf(4);
    const password = {
      algorithm: arr[0],
      derivedKey: arr[3],
      iterations: parseInt(arr[1], 10),
      salt: arr[2],
    };
    expect(password.algorithm).to.equal('pbkdf2_sha256');
    expect(password.iterations).to.equal(100000);
    expect(password.salt).to.have.lengthOf(32);
    expect(password.derivedKey).to.have.lengthOf(128);

    const derivedKey = await promisify(pbkdf2)(
      'my_strong_password', password.salt, password.iterations, 64, 'sha256'
    );
    expect(derivedKey.toString('hex')).to.equal(password.derivedKey);
  });

});

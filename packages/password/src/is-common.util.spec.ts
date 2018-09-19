// std
import { strictEqual } from 'assert';

// 3p
import { isCommon } from './is-common.util';

describe('isCommon', () => {

  it('should return true if the given password is part of the 10000 most common passwords.', async () => {
    strictEqual(await isCommon('12345'), true);
  });

  it('should return false if the given password is not part of the 10000 most common passwords.', async () => {
    strictEqual(await isCommon('a bird in the sky'), false);
  });

});

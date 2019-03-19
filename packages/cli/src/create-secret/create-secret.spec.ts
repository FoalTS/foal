// std
import { strictEqual } from 'assert';

// FoalTS
import { createSecret } from './create-secret';

describe('createSecret', () => {

  it('should generate a 256-bit secret encoded in base64.', async () => {
    const secret = await createSecret();
    strictEqual(secret.length, 44);
  });

});

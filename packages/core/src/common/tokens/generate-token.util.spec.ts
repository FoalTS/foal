// std
import { strictEqual } from 'assert';

// FoalTS
import { generateToken } from './generate-token.util';

describe('generateToken', () => {

  it('should generate a random base64url-encoded string which size is 256 bits.', async () => {
    const token = await generateToken();

    const buffer = Buffer.from(token, 'base64');
    strictEqual(buffer.length, 32);
    strictEqual(token.includes('='), false);

    // The below tests are bad because the ID is different each time this test is ran.
    strictEqual(token.includes('+'), false);
    strictEqual(token.includes('/'), false);
  });

});

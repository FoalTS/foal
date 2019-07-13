import { notDeepStrictEqual, strictEqual } from 'assert';
import { generateSignedToken } from './generate-signed-token.util';
import { verifySignedToken } from './verify-signed-token.util';

describe('generateSignedToken', () => {
  it('should generate a base64url-encoded token along with its signature.', async () => {
    const secret = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
    const signedToken = await generateSignedToken(secret);

    const unsignedToken = verifySignedToken(signedToken, secret);
    if (unsignedToken === false) {
      throw new Error('verifySignedToken should return the token without its signature.');
    }
    notDeepStrictEqual(unsignedToken, false);
    strictEqual(signedToken.startsWith(signedToken), true);
    strictEqual(Buffer.from(unsignedToken, 'base64').length, 32);
  });
});

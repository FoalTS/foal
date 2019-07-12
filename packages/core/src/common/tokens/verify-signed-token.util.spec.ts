// std
import { strictEqual } from 'assert';

// FoalTS
import { verifySignedToken } from './verify-signed-token.util';

describe('verifySignedToken', () => {

  it('should return false if the token is not a string.', () => {
    strictEqual(verifySignedToken(3 as any, 'secret'), false);
  });

  it('should return false if the token format is invalid.', () => {
    strictEqual(verifySignedToken('xxx', 'secret'), false);
    strictEqual(verifySignedToken('.xxx', 'secret'), false);
    strictEqual(verifySignedToken('xxx.', 'secret'), false);
    strictEqual(verifySignedToken('.', 'secret'), false);
  });

  it('should verify the token and return false if the signature is incorrect.', () => {
    const secret = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
    const signedToken = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZOaaaHS9VepB5dyhJiUIPaa2wfk';

    strictEqual(verifySignedToken(signedToken, secret), false);
  });

  it('should verify the token and return the unsigned token if the signature is correct.', () => {
    const secret = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
    const signedToken = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk';

    strictEqual(verifySignedToken(signedToken, secret), '-_BmZmZmZmZmZmZmZmZmZg');
  });

});

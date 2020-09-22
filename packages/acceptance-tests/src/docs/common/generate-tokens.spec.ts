// std
import { strictEqual } from 'assert';

// FoalTS
import { generateSignedToken, generateToken, verifySignedToken } from '@foal/core';

describe('[Docs] Cookbook > Generate (and Verify) Tokens', () => {

  it('Unsigned Tokens (simple case)', async () => {
    const token = await generateToken();

    strictEqual(typeof token, 'string');
  });

  it('Signed Tokens', async () => {
    const secret = 'aaa';
    const token = await generateSignedToken(secret);

    strictEqual(typeof token, 'string');

    const signedTokenToVerify = 'xxx.yyy';
    const result = await verifySignedToken(signedTokenToVerify, secret);

    strictEqual(result, false);
  });

});

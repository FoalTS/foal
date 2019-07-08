// std
import { strictEqual } from 'assert';

// FoalTS
import { createHmac } from 'crypto';
import { signToken } from './sign-token.util';

describe('signToken', () => {
  it('should sign the base64-encoded (or base64url-encoded) token with the given base64-encoded secret.', () => {
    const secretBuffer = Buffer.from([
      0xFB, 0xF0, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
    ]); // 32 bytes (256 bits)
    const unsignedTokenBuffer = Buffer.from([
      0xFB, 0xF0, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
      0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
    ]); // 16 bytes (128 bits)

    // Base64 value: +/BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY=
    const secret = secretBuffer.toString('base64').replace('+', '-').replace('/', '_').replace('=', '');
    strictEqual(secret, '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY');

    // Base64 value: +/BmZmZmZmZmZmZmZmZmZg==
    const unsignedToken = unsignedTokenBuffer.toString('base64').replace('+', '-').replace('/', '_').replace('==', '');
    strictEqual(unsignedToken, '-_BmZmZmZmZmZmZmZmZmZg');

    // Base64 value: rD1LLZl5sr+IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk=
    const signature = createHmac('sha256', secretBuffer)
      .update(unsignedTokenBuffer)
      .digest('base64')
      .replace('+', '-')
      .replace('=', '');
    strictEqual(signature, 'rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk');

    const signedToken = signToken(unsignedToken, secret);

    strictEqual(signedToken, `${unsignedToken}.${signature}`);
  });
});

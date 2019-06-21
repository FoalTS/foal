// std
import { timingSafeEqual } from 'crypto';

// FoalTS
import { sign } from './sign-token.util';

/**
 * Verify a base64-encoded (or base64url-encoded) signed token against a secret.
 *
 * Returns false if the token format is invalid or the signature does not match.
 *
 * Returns the token without its signature otherwise.
 *
 * @export
 * @param {string} signedToken - The signed token
 * @param {string} secret - The base64-encoded secret with which the token is supposed to have been signed with.
 * @returns {(string|false)} - False or the unsigned token.
 */
export function verifySignedToken(signedToken: string, secret: string): string|false {
  if (typeof signedToken !== 'string') {
    return false;
  }
  const [ unsignedToken, signature ] = signedToken.split('.');
  // signature is potentially undefined
  if (signature === undefined) {
    return false;
  }

  const expectedSignatureBuffer = sign(unsignedToken, secret);
  const actualSignatureBuffer = Buffer.alloc(expectedSignatureBuffer.length);
  actualSignatureBuffer.write(signature, 0, actualSignatureBuffer.length, 'base64');

  if (timingSafeEqual(expectedSignatureBuffer, actualSignatureBuffer)) {
    return unsignedToken;
  }
  return false;
}

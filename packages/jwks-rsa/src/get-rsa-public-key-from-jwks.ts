import { InvalidTokenError } from '@foal/jwt';
// tslint:disable-next-line:no-var-requires
const jwksClient = require('jwks-rsa');

// The below interfaces comes from here: https://github.com/auth0/node-jwks-rsa/blob/master/index.d.ts
// We cannot simply use "import { JwksRsa } from 'jwks-rsa';" because it requires to install express-jwt...

export interface Headers {
  [key: string]: string;
}

export interface Options {
  jwksUri: string;
  rateLimit?: boolean;
  cache?: boolean;
  cacheMaxEntries?: number;
  cacheMaxAge?: number;
  jwksRequestsPerMinute?: number;
  strictSsl?: boolean;
  requestHeaders?: Headers;
  handleSigningKeyError?(err: Error, cb: (err: Error) => void): any;
}

/**
 * Create a function to retreive the RSA public key from a JWKS endpoint based on the kid of
 * the given JWT header.
 *
 * @export
 * @param {Options} options - Options of the jwks-rsa package.
 * @returns {(header: any, payload: any) => Promise<string>} The returned function.
 */
export function getRSAPublicKeyFromJWKS(options: Options): (header: any, payload: any) => Promise<string> {
  return async ({ alg, kid }) => {
    if (alg !== 'RS256') {
      throw new InvalidTokenError('invalid algorithm');
    }
    if (kid === undefined) {
      throw new InvalidTokenError('missing kid');
    }

    const client = jwksClient(options);

    return new Promise<string>((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err) {
          return reject(err.name === 'SigningKeyNotFoundError' ? new InvalidTokenError('invalid kid') : err);
        }
        // "key.publicKey || key.rsaPublicKey" because of
        // https://github.com/auth0/node-jwks-rsa/blob/master/src/integrations/express.js#L36
        // The " || key.rsaPublicKey" part is currently not tested.
        resolve(key.publicKey || key.rsaPublicKey);
      });
    });
  };
}

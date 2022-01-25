// std
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

// 3p
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
  proxy?: string;
  requestHeaders?: Headers;
  timeout?: number;
  requestAgent?: HttpAgent | HttpsAgent;
  fetcher?(jwksUri: string): Promise<{ keys: any }>;
  getKeysInterceptor?(): Promise<JSONWebKey[]>;
}

export interface JSONWebKey {
  kid: string,
  alg: string,
  [key: string]: any
}


interface JwksClient {
  getSigningKey(kid?: string | null | undefined): Promise<SigningKey>;
}

interface CertSigningKey {
  kid: string;
  alg: string;
  getPublicKey(): string;
  publicKey: string;
}

interface RsaSigningKey {
  kid: string;
  alg: string;
  getPublicKey(): string;
  rsaPublicKey: string;
}

type SigningKey = CertSigningKey | RsaSigningKey;

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

    const client = jwksClient(options) as JwksClient;

    try {
      const key = await client.getSigningKey(kid);
      return key.getPublicKey();
    } catch (err: any) {
      if (err.name === 'SigningKeyNotFoundError') {
        throw new InvalidTokenError('invalid kid');
      }
      throw err;
    }
  };
}

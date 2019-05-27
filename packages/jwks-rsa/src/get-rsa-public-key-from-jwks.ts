import { Options } from 'jwks-rsa';

export function getRSAPublicKeyFromJWKS(options: Options): (header: any, payload: any) => Promise<string> {
  return async ({ alg, kid }, payload) => {
    if (alg !== 'RS256') {
      return '';
    }
    return 'eeee';
  };
}

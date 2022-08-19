// std
import { strictEqual } from 'assert';

// 3p
import { Context } from '@foal/core';

// FoalTS
import { getCsrfTokenFromRequest } from './get-csrf-token-from-request';

function createRequest(body: { [name: string]: any }, headers: { [name: string ]: string}): Context['request'] {
  return {
    body,
    get(headerName: string): string|undefined {
      return headers[headerName];
    }
  } as Context['request'];
}

describe('getCsrfTokenFromRequest', () => {
  context('given the CSRF token is in the request body field "_csrf"', () => {
    it('should return the CSRF token.', () => {
      const token = '123';
      const request = createRequest({ _csrf: token }, {});
      const csrfToken = getCsrfTokenFromRequest(request);

      strictEqual(csrfToken, token);
    });
  });
  context('given the CSRF token is in the request header "X-CSRF-Token"', () => {
    it('should return the CSRF token.', () => {
      const token = '123';
      const request = createRequest({}, { 'X-CSRF-Token': token });
      const csrfToken = getCsrfTokenFromRequest(request);

      strictEqual(csrfToken, token);
    });
  });
  context('given the CSRF token is in the request header "X-XSRF-Token"', () => {
    it('should return the CSRF token.', () => {
      const token = '123';
      const request = createRequest({}, { 'X-XSRF-Token': token });
      const csrfToken = getCsrfTokenFromRequest(request);

      strictEqual(csrfToken, token);
    });
  });
  context('given the CSRF token is not provided', () => {
    it('should return undefined.', () => {
      const request = createRequest({}, {});
      const csrfToken = getCsrfTokenFromRequest(request);

      strictEqual(csrfToken, undefined);
    });
  });
});
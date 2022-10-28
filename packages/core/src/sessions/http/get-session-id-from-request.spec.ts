import { strictEqual, throws } from 'assert';
import { Config, Context } from '../../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { getSessionIDFromRequest, RequestValidationError } from './get-session-id-from-request';

function createEmptyRequest(): Context['request'] {
  return {
    get(headerName: string): string|undefined {
      return;
    },
    cookies: {},
  } as Context['request'];
}

function createRequestWithHeader(name: string, value: string): Context['request'] {
  return {
    ...createEmptyRequest(),
    get(headerName: string): string|undefined {
      if (headerName === name) {
        return value;
      }
    }
  } as Context['request'];
}

function createRequestWithCookie(name: string, value: string): Context['request'] {
  return {
    ...createEmptyRequest(),
    cookies: {
      [name]: value
    }
  } as Context['request'];
}

describe('getSessionIDFromRequest', () => {
  context('given the location is "token-in-header"', () => {
    context('given the "required" option is false', () => {
      it('should return undefined if the request has no "Authorization" header.', () => {
        const request = createEmptyRequest();
        const sessionID = getSessionIDFromRequest(request, 'token-in-header', false);

        strictEqual(sessionID, undefined);
      });
      it('should throw a RequestValidationError if the request has an "Authorization" header but does NOT use the bearer scheme.', () => {
        const request = createRequestWithHeader('Authorization', 'Basic 123');
        const error = () => getSessionIDFromRequest(request, 'token-in-header', false);

        throws(error, new RequestValidationError('Expected a bearer token. Scheme is Authorization: Bearer <token>.'));
      });
      it('should return the session ID if it is provided in an "Authorization" header with a bearer scheme.', () => {
        const request = createRequestWithHeader('Authorization', 'Bearer 123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-header', false);

        strictEqual(sessionID, '123');
      });
    });
    context('given the "required" option is true', () => {
      it('should throw a RequestValidationError if the request has no "Authorization" header.', () => {
        const request = createEmptyRequest();
        const error = () => getSessionIDFromRequest(request, 'token-in-header', true);

        throws(error, new RequestValidationError('Authorization header not found.'));
      });
      it('should throw a RequestValidationError if the request has an "Authorization" header but does NOT use the bearer scheme.', () => {
        const request = createRequestWithHeader('Authorization', 'Basic 123');
        const error = () => getSessionIDFromRequest(request, 'token-in-header', true);

        throws(error, new RequestValidationError('Expected a bearer token. Scheme is Authorization: Bearer <token>.'));
      });
      it('should return the session ID if it is provided in an "Authorization" header with a bearer scheme.', () => {
        const request = createRequestWithHeader('Authorization', 'Bearer 123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-header', true);

        strictEqual(sessionID, '123');
      });
    });
  });
  context('given the location is "token-in-cookie"', () => {
    afterEach(() => {
      Config.remove('settings.session.cookie.name');
    });

    context('given the "required" option is false', () => {
      it('should return undefined if the request has no session cookie.', () => {
        const request = createEmptyRequest();
        const sessionID = getSessionIDFromRequest(request, 'token-in-cookie', false);

        strictEqual(sessionID, undefined);
      });
      it('should return the session ID if it is provided in a session cookie (default cookie name).', () => {
        const request = createRequestWithCookie(SESSION_DEFAULT_COOKIE_NAME, '123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-cookie', false);

        strictEqual(sessionID, '123');
      });
      it('should return the session ID if it is provided in a session cookie (custom cookie name).', () => {
        Config.set('settings.session.cookie.name', 'custom-cookie-name');

        const request = createRequestWithCookie('custom-cookie-name', '123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-cookie', false);

        strictEqual(sessionID, '123');
      });
    });
    context('given the "required" option is true', () => {
      it('should throw a RequestValidationError if the request has no session cookie.', () => {
        const request = createEmptyRequest();
        const error = () => getSessionIDFromRequest(request, 'token-in-cookie', true);

        throws(error, new RequestValidationError('Session cookie not found.'));
      });
      it('should return the session ID if it is provided in a session cookie (default cookie name).', () => {
        const request = createRequestWithCookie(SESSION_DEFAULT_COOKIE_NAME, '123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-cookie', true);

        strictEqual(sessionID, '123');
      });
      it('should return the session ID if it is provided in a session cookie (custom cookie name).', () => {
        Config.set('settings.session.cookie.name', 'custom-cookie-name');

        const request = createRequestWithCookie('custom-cookie-name', '123');
        const sessionID = getSessionIDFromRequest(request, 'token-in-cookie', true);

        strictEqual(sessionID, '123');
      });
    });
  });
  context('given the location is invalid', () => {
    it('should throw an Error.', () => {
      const request = createEmptyRequest();
      const error = () => getSessionIDFromRequest(request, 'invalid' as any, false);

      throws(error, new Error('Invalid location.'));
    });
  });
});

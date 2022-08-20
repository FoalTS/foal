// std
import { strictEqual } from 'assert';

// 3p
import { Config, Context, HttpMethod } from '@foal/core';

// FoalTS
import { JWTOptions } from '../jwt.hook';
import { shouldVerifyCsrfToken } from './should-verify-csrf-token';

function createRequest(method: HttpMethod): Context['request'] {
  return {
    method
  } as Context['request'];
}

function createJwtOptions({ cookie, csrf }: { cookie?: boolean, csrf?: boolean }): JWTOptions {
  return {
    cookie,
    csrf
  };
}

describe('shouldVerifyCsrfToken', () => {
  context('given options.cookie is undefined', () => {
    it('should return false.', () => {
      const request = createRequest('POST');
      const options = createJwtOptions({
        cookie: undefined,
        csrf: true
      });
      const actual = shouldVerifyCsrfToken(request, options);
      const expected = false;

      strictEqual(actual, expected);
    });
  });
  context('given options.cookie is false', () => {
    it('should return false.', () => {
      const request = createRequest('POST');
      const options = createJwtOptions({
        cookie: false,
        csrf: true
      });
      const actual = shouldVerifyCsrfToken(request, options);
      const expected = false;

      strictEqual(actual, expected);
    });
  });
  context('given options.cookie is true', () => {
    context('given options.csrf is undefined', () => {
      it('should return false.', () => {
        const request = createRequest('POST');
        const options = createJwtOptions({
          cookie: true,
          csrf: undefined
        });
        const actual = shouldVerifyCsrfToken(request, options);
        const expected = false;

        strictEqual(actual, expected);
      });
    });
    context('given options.csrf is false', () => {
      it('should return false.', () => {
        const request = createRequest('POST');
        const options = createJwtOptions({
          cookie: true,
          csrf: false
        });
        const actual = shouldVerifyCsrfToken(request, options);
        const expected = false;

        strictEqual(actual, expected);
      });
    });
    context('given options.csrf is true', () => {
      context('given request.method is GET', () => {
        it('should return false.', () => {
          const request = createRequest('GET');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = false;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is HEAD', () => {
        it('should return false.', () => {
          const request = createRequest('HEAD');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = false;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is OPTIONS', () => {
        it('should return false.', () => {
          const request = createRequest('OPTIONS');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = false;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is DELETE', () => {
        it('should return true.', () => {
          const request = createRequest('DELETE');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = true;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is PATCH', () => {
        it('should return true.', () => {
          const request = createRequest('PATCH');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = true;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is POST', () => {
        it('should return true.', () => {
          const request = createRequest('POST');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = true;

          strictEqual(actual, expected);
        });
      });
      context('given request.method is PUT', () => {
        it('should return true.', () => {
          const request = createRequest('PUT');
          const options = createJwtOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = true;

          strictEqual(actual, expected);
        });
      });
    });
    context('given the configuration "settings.jwt.csrf.enabled" is true and options.csrf is not defined', () => {
      afterEach(() => Config.remove('settings.jwt.csrf.enabled'));

      it('should return true if request.method is POST.', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        const request = createRequest('POST');
        const options = createJwtOptions({
          cookie: true,
          csrf: undefined
        });
        const actual = shouldVerifyCsrfToken(request, options);
        const expected = true;

        strictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.jwt.csrf.enabled" is true and options.csrf is false', () => {
      afterEach(() => Config.remove('settings.jwt.csrf.enabled'));

      it('should return false even if request.method is POST.', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        const request = createRequest('POST');
        const options = createJwtOptions({
          cookie: true,
          csrf: false
        });
        const actual = shouldVerifyCsrfToken(request, options);
        const expected = false;

        strictEqual(actual, expected);
      });
    });
  });
});
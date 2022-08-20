// std
import { strictEqual } from 'assert';

// FoalTS
import { Config, Context, HttpMethod } from '../../../core';
import { UseSessionOptions } from '../use-sessions.hook';
import { shouldVerifyCsrfToken } from './should-verify-csrf-token';

function createRequest(method: HttpMethod): Context['request'] {
  return {
    method
  } as Context['request'];
}

function createSessionOptions({ cookie, csrf }: { cookie?: boolean, csrf?: boolean }): UseSessionOptions {
  return {
    cookie,
    csrf
  };
}

describe('shouldVerifyCsrfToken', () => {
  context('given options.cookie is undefined', () => {
    it('should return false.', () => {
      const request = createRequest('POST');
      const options = createSessionOptions({
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
      const options = createSessionOptions({
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
        const options = createSessionOptions({
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
        const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
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
          const options = createSessionOptions({
            cookie: true,
            csrf: true
          });
          const actual = shouldVerifyCsrfToken(request, options);
          const expected = true;

          strictEqual(actual, expected);
        });
      });
    });
    context('given the configuration "settings.session.csrf.enabled" is true and options.csrf is not defined', () => {
      afterEach(() => Config.remove('settings.session.csrf.enabled'));

      it('should return true if request.method is POST.', () => {
        Config.set('settings.session.csrf.enabled', true);

        const request = createRequest('POST');
        const options = createSessionOptions({
          cookie: true,
          csrf: undefined
        });
        const actual = shouldVerifyCsrfToken(request, options);
        const expected = true;

        strictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.session.csrf.enabled" is true and options.csrf is false', () => {
      afterEach(() => Config.remove('settings.session.csrf.enabled'));

      it('should return false even if request.method is POST.', () => {
        Config.set('settings.session.csrf.enabled', true);

        const request = createRequest('POST');
        const options = createSessionOptions({
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
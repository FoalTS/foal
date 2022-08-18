// std
import { strictEqual } from 'assert';

// 3p
import { Config, HttpResponse, HttpResponseOK } from '@foal/core';

// FoalTS
import {
  JWT_DEFAULT_COOKIE_NAME,
  JWT_DEFAULT_COOKIE_PATH,
  JWT_DEFAULT_CSRF_COOKIE_NAME,
  JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED
} from './constants';
import { removeAuthCookie } from './remove-auth-cookie';

describe('removeAuthCookie', () => {

  let response: HttpResponse;

  beforeEach(() => response = new HttpResponseOK());

  describe('should set an auth cookie in the response', () => {

    context('given no configuration option is provided', () => {

      beforeEach(() => removeAuthCookie(response));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(value, '');
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.domain, undefined);
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.httpOnly, undefined);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.path, JWT_DEFAULT_COOKIE_PATH);
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.secure, undefined);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.maxAge, 0);
      });

    });

    context('given configuration options are provided', () => {

      const cookieName = JWT_DEFAULT_COOKIE_NAME + '2';

      beforeEach(() => {
        Config.set('settings.jwt.cookie.name', cookieName);
        Config.set('settings.jwt.cookie.domain', 'example.com');
        Config.set('settings.jwt.cookie.httpOnly', false);
        Config.set('settings.jwt.cookie.path', '/foo');
        Config.set('settings.jwt.cookie.sameSite', 'strict');
        Config.set('settings.jwt.cookie.secure', true);
        removeAuthCookie(response);
      });

      afterEach(() => {
        Config.remove('settings.jwt.cookie.name');
        Config.remove('settings.jwt.cookie.domain');
        Config.remove('settings.jwt.cookie.httpOnly');
        Config.remove('settings.jwt.cookie.path');
        Config.remove('settings.jwt.cookie.sameSite');
        Config.remove('settings.jwt.cookie.secure');
      });

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(cookieName);
        strictEqual(value, '');
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.domain, 'example.com');
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.httpOnly, false);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.path, '/foo');
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.sameSite, 'strict');
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.secure, true);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.maxAge, 0);
      });

    });

  });

  context('given the CSRF protection is enabled in the config', () => {

    beforeEach(() => Config.set('settings.jwt.csrf.enabled', true));

    afterEach(() => Config.remove('settings.jwt.csrf.enabled'));

    describe('should set an auth cookie in the response', () => {

      context('given no configuration option is provided', () => {

        beforeEach(() => removeAuthCookie(response));

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

      });

      context('given configuration options are provided', () => {

        beforeEach(() => {
          Config.set('settings.jwt.cookie.sameSite', 'strict');
          removeAuthCookie(response);
        });

        afterEach(() => {
          Config.remove('settings.jwt.cookie.sameSite');
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, 'strict');
        });

      });

    });

    describe('should set a CSRF cookie in the response', () => {

      context('given no configuration option is provided', () => {

        beforeEach(() => removeAuthCookie(response));

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(value, '');
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.domain, undefined);
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.path, JWT_DEFAULT_COOKIE_PATH);
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.sameSite, JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.secure, undefined);
        });

        it('with the proper "maxAge" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.maxAge, 0);
        });

      });

      context('given configuration options are provided', () => {

        const csrfCookieName = JWT_DEFAULT_CSRF_COOKIE_NAME + '2';

        beforeEach(() => {
          Config.set('settings.jwt.csrf.cookie.name', csrfCookieName);
          Config.set('settings.jwt.cookie.domain', 'example.com');
          Config.set('settings.jwt.cookie.httpOnly', true);
          Config.set('settings.jwt.cookie.path', '/foo');
          Config.set('settings.jwt.cookie.sameSite', 'strict');
          Config.set('settings.jwt.cookie.secure', true);
          removeAuthCookie(response);
        });

        afterEach(() => {
          Config.remove('settings.jwt.csrf.cookie.name');
          Config.remove('settings.jwt.cookie.domain');
          Config.remove('settings.jwt.cookie.httpOnly');
          Config.remove('settings.jwt.cookie.path');
          Config.remove('settings.jwt.cookie.sameSite');
          Config.remove('settings.jwt.cookie.secure');
        });

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(csrfCookieName);
          strictEqual(value, '');
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.domain, 'example.com');
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.path, '/foo');
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.sameSite, 'strict');
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.secure, true);
        });

        it('with the proper "maxAge" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.maxAge, 0);
        });

      });

    });

  });

  context('given the CSRF protection is disabled in the config', () => {

    beforeEach(() => removeAuthCookie(response));

    it('should not set a CSRF cookie in the response.', () => {
      const { value } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
      strictEqual(value, undefined);
    });

  });

});

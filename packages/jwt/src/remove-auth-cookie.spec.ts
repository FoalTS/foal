// std
import { strictEqual } from 'assert';

// 3p
import { HttpResponse, HttpResponseOK } from '@foal/core';

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
        process.env.SETTINGS_JWT_COOKIE_NAME = cookieName;
        process.env.SETTINGS_JWT_COOKIE_DOMAIN = 'example.com';
        process.env.SETTINGS_JWT_COOKIE_HTTP_ONLY = 'false';
        process.env.SETTINGS_JWT_COOKIE_PATH = '/foo';
        process.env.SETTINGS_JWT_COOKIE_SAME_SITE = 'strict';
        process.env.SETTINGS_JWT_COOKIE_SECURE = 'true';
        removeAuthCookie(response);
      });

      afterEach(() => {
        delete process.env.SETTINGS_JWT_COOKIE_NAME;
        delete process.env.SETTINGS_JWT_COOKIE_DOMAIN;
        delete process.env.SETTINGS_JWT_COOKIE_HTTP_ONLY;
        delete process.env.SETTINGS_JWT_COOKIE_PATH;
        delete process.env.SETTINGS_JWT_COOKIE_SAME_SITE;
        delete process.env.SETTINGS_JWT_COOKIE_SECURE;
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

    beforeEach(() => process.env.SETTINGS_JWT_CSRF_ENABLED = 'true');

    afterEach(() => delete process.env.SETTINGS_JWT_CSRF_ENABLED);

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
          process.env.SETTINGS_JWT_COOKIE_SAME_SITE = 'strict';
          removeAuthCookie(response);
        });

        afterEach(() => {
          delete process.env.SETTINGS_JWT_COOKIE_SAME_SITE;
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
          process.env.SETTINGS_JWT_CSRF_COOKIE_NAME = csrfCookieName;
          process.env.SETTINGS_JWT_COOKIE_DOMAIN = 'example.com';
          process.env.SETTINGS_JWT_COOKIE_HTTP_ONLY = 'true';
          process.env.SETTINGS_JWT_COOKIE_PATH = '/foo';
          process.env.SETTINGS_JWT_COOKIE_SAME_SITE = 'strict';
          process.env.SETTINGS_JWT_COOKIE_SECURE = 'true';
          removeAuthCookie(response);
        });

        afterEach(() => {
          delete process.env.SETTINGS_JWT_CSRF_COOKIE_NAME;
          delete process.env.SETTINGS_JWT_COOKIE_DOMAIN;
          delete process.env.SETTINGS_JWT_COOKIE_HTTP_ONLY;
          delete process.env.SETTINGS_JWT_COOKIE_PATH;
          delete process.env.SETTINGS_JWT_COOKIE_SAME_SITE;
          delete process.env.SETTINGS_JWT_COOKIE_SECURE;
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

import { deepStrictEqual, strictEqual } from 'assert';
import { HttpResponse, HttpResponseOK } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY,
  SESSION_DEFAULT_COOKIE_NAME,
  SESSION_DEFAULT_COOKIE_PATH,
  SESSION_DEFAULT_CSRF_COOKIE_NAME,
  SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED,
} from './constants';
import { Session } from './session';
import { setSessionCookie } from './set-session-cookie';

describe('setSessionCookie', () => {

  let token: string;
  let csrfToken: string;
  let session: Session;
  let response: HttpResponse;

  beforeEach(() => {
    response = new HttpResponseOK();
    token = 'xxx';
    csrfToken = 'yyy',
    session = new Session(
      {} as any,
      {
        content: {
          csrfToken,
        },
        createdAt: Math.trunc(Date.now() / 1000),
        flash: {},
        id: token,
        updatedAt: Math.trunc(Date.now() / 1000),
        userId: null,
      },
      { exists: true },
    );
  });

  describe('should set a session cookie in the response', () => {

    context('given no configuration option is provided', () => {

      beforeEach(() => setSessionCookie(response, session));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, token);
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.domain, undefined);
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.httpOnly, SESSION_DEFAULT_COOKIE_HTTP_ONLY);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.path, SESSION_DEFAULT_COOKIE_PATH);
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.secure, undefined);
      });

      it('with the proper "expires" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
      });

    });

    context('given configuration options are provided', () => {

      const cookieName = SESSION_DEFAULT_COOKIE_NAME + '2';

      beforeEach(() => {
        process.env.SETTINGS_SESSION_COOKIE_NAME = cookieName;
        process.env.SETTINGS_SESSION_COOKIE_DOMAIN = 'example.com';
        process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY = 'false';
        process.env.SETTINGS_SESSION_COOKIE_PATH = '/foo';
        process.env.SETTINGS_SESSION_COOKIE_SAME_SITE = 'strict';
        process.env.SETTINGS_SESSION_COOKIE_SECURE = 'true';
        setSessionCookie(response, session);
      });

      afterEach(() => {
        delete process.env.SETTINGS_SESSION_COOKIE_NAME;
        delete process.env.SETTINGS_SESSION_COOKIE_DOMAIN;
        delete process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY;
        delete process.env.SETTINGS_SESSION_COOKIE_PATH;
        delete process.env.SETTINGS_SESSION_COOKIE_SAME_SITE;
        delete process.env.SETTINGS_SESSION_COOKIE_SECURE;
      });

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(cookieName);
        strictEqual(value, token);
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

      it('with the proper "expires" directive.', () => {
        const { options } = response.getCookie(cookieName);
        deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
      });

    });

  });

  context('given the CSRF protection is enabled in the config', () => {

    beforeEach(() => process.env.SETTINGS_SESSION_CSRF_ENABLED = 'true');

    afterEach(() => delete process.env.SETTINGS_SESSION_CSRF_ENABLED);

    describe('should set a session cookie in the response', () => {

      context('given no configuration option is provided', () => {

        beforeEach(() => setSessionCookie(response, session));

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

      });

      context('given configuration options are provided', () => {

        beforeEach(() => {
          process.env.SETTINGS_SESSION_COOKIE_SAME_SITE = 'strict';
          setSessionCookie(response, session);
        });

        afterEach(() => {
          delete process.env.SETTINGS_SESSION_COOKIE_SAME_SITE;
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, 'strict');
        });

      });

    });

    describe('should set a CSRF cookie in the response', () => {

      context('given no configuration option is provided', () => {

        beforeEach(() => setSessionCookie(response, session));

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(value, csrfToken);
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.domain, undefined);
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.path, SESSION_DEFAULT_COOKIE_PATH);
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.sameSite, SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.secure, undefined);
        });

        it('with the proper "expires" directive.', () => {
          const { options } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
          deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
        });

      });

      context('given configuration options are provided', () => {

        const csrfCookieName = SESSION_DEFAULT_CSRF_COOKIE_NAME + '2';

        beforeEach(() => {
          process.env.SETTINGS_SESSION_CSRF_COOKIE_NAME = csrfCookieName;
          process.env.SETTINGS_SESSION_COOKIE_DOMAIN = 'example.com';
          process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY = 'true';
          process.env.SETTINGS_SESSION_COOKIE_PATH = '/foo';
          process.env.SETTINGS_SESSION_COOKIE_SAME_SITE = 'strict';
          process.env.SETTINGS_SESSION_COOKIE_SECURE = 'true';
          setSessionCookie(response, session);
        });

        afterEach(() => {
          delete process.env.SETTINGS_SESSION_CSRF_COOKIE_NAME;
          delete process.env.SETTINGS_SESSION_COOKIE_DOMAIN;
          delete process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY;
          delete process.env.SETTINGS_SESSION_COOKIE_PATH;
          delete process.env.SETTINGS_SESSION_COOKIE_SAME_SITE;
          delete process.env.SETTINGS_SESSION_COOKIE_SECURE;
        });

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(csrfCookieName);
          strictEqual(value, csrfToken);
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

        it('with the proper "expires" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
        });

      });

    });

  });

  context('given the CSRF protection is disabled in the config', () => {

    beforeEach(() => setSessionCookie(response, session));

    it('should not set a CSRF cookie in the response.', () => {
      const { value } = response.getCookie(SESSION_DEFAULT_CSRF_COOKIE_NAME);
      strictEqual(value, undefined);
    });

  });

});

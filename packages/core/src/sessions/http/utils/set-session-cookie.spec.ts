// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Config, HttpResponse, HttpResponseOK } from '../../../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY,
  SESSION_DEFAULT_COOKIE_NAME,
  SESSION_DEFAULT_COOKIE_PATH,
  SESSION_DEFAULT_CSRF_COOKIE_NAME,
  SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED,
  SESSION_USER_COOKIE_NAME,
} from '../constants';
import { Session } from '../../core';
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
        Config.set('settings.session.cookie.name', cookieName);
        Config.set('settings.session.cookie.domain', 'example.com');
        Config.set('settings.session.cookie.httpOnly', false);
        Config.set('settings.session.cookie.path', '/foo');
        Config.set('settings.session.cookie.sameSite', 'strict');
        Config.set('settings.session.cookie.secure', true);
        setSessionCookie(response, session);
      });

      afterEach(() => {
        Config.remove('settings.session.cookie.name');
        Config.remove('settings.session.cookie.domain');
        Config.remove('settings.session.cookie.httpOnly');
        Config.remove('settings.session.cookie.path');
        Config.remove('settings.session.cookie.sameSite');
        Config.remove('settings.session.cookie.secure');
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

    beforeEach(() => Config.set('settings.session.csrf.enabled', true));

    afterEach(() => Config.remove('settings.session.csrf.enabled'));

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
          Config.set('settings.session.cookie.sameSite', 'strict');
          setSessionCookie(response, session);
        });

        afterEach(() => {
          Config.remove('settings.session.cookie.sameSite');
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
          Config.set('settings.session.csrf.cookie.name', csrfCookieName);
          Config.set('settings.session.cookie.domain', 'example.com');
          Config.set('settings.session.cookie.httpOnly', true);
          Config.set('settings.session.cookie.path', '/foo');
          Config.set('settings.session.cookie.sameSite', 'strict');
          Config.set('settings.session.cookie.secure', true);
          setSessionCookie(response, session);
        });

        afterEach(() => {
          Config.remove('settings.session.csrf.cookie.name');
          Config.remove('settings.session.cookie.domain');
          Config.remove('settings.session.cookie.httpOnly');
          Config.remove('settings.session.cookie.path');
          Config.remove('settings.session.cookie.sameSite');
          Config.remove('settings.session.cookie.secure');
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

  context('given the "user" argument is defined', () => {

    describe('should set a "user" cookie in the response', () => {

      const user = 'foo';

      context('given no configuration option is provided', () => {

        beforeEach(() => setSessionCookie(response, session, user));

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(value, user);
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.domain, undefined);
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.path, SESSION_DEFAULT_COOKIE_PATH);
        });

        // Adding the sameSite directive is useless. We keep it for consistency.
        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.sameSite, undefined);
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.secure, undefined);
        });

        it('with the proper "expires" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
        });

      });

      context('given configuration options are provided', () => {

        beforeEach(() => {
          Config.set('settings.session.cookie.domain', 'example.com');
          Config.set('settings.session.cookie.httpOnly', true);
          Config.set('settings.session.cookie.path', '/foo');
          Config.set('settings.session.cookie.sameSite', 'strict');
          Config.set('settings.session.cookie.secure', true);
          setSessionCookie(response, session, user);
        });

        afterEach(() => {
          Config.remove('settings.session.cookie.domain');
          Config.remove('settings.session.cookie.httpOnly');
          Config.remove('settings.session.cookie.path');
          Config.remove('settings.session.cookie.sameSite');
          Config.remove('settings.session.cookie.secure');
        });

        it('with the proper default name and value.', () => {
          const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(value, user);
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.domain, 'example.com');
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.path, '/foo');
        });

        // Adding the sameSite directive is useless. We keep it for consistency.
        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.sameSite, 'strict');
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(options.secure, true);
        });

        it('with the proper "expires" directive.', () => {
          const { options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          deepStrictEqual(options.expires, new Date(session.expirationTime * 1000));
        });

      });

    });

  });

  context('given the "user" argument is empty or not defined', () => {

    beforeEach(() => setSessionCookie(response, session));

    it('should not set a CSRF cookie in the response.', () => {
      const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
      strictEqual(value, undefined);
    });

  });

});

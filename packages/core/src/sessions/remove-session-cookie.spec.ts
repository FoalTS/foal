import { strictEqual } from 'assert';
import { HttpResponse, HttpResponseOK } from '../core';
import { removeSessionCookie } from './remove-session-cookie';

describe('removeSessionCookie', () => {

  let response: HttpResponse;

  before(() => process.env.SETTINGS_SESSION_SECRET = 'secret');

  after(() => delete process.env.SETTINGS_SESSION_SECRET);

  beforeEach(() => response = new HttpResponseOK());

  describe('should set a session cookie in the response', () => {

    describe('given no configuration option is provided', () => {

      beforeEach(() => removeSessionCookie(response));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie('auth');
        strictEqual(value, '');
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.domain, undefined);
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.httpOnly, true);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.path, '/');
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.secure, undefined);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie('auth');
        strictEqual(options.maxAge, 0);
      });

    });

    describe('given configuration options are provided', () => {

      beforeEach(() => {
        process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';
        process.env.SETTINGS_SESSION_COOKIE_DOMAIN = 'example.com';
        process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY = 'false';
        process.env.SETTINGS_SESSION_COOKIE_PATH = '/foo';
        process.env.SETTINGS_SESSION_COOKIE_SAME_SITE = 'strict';
        process.env.SETTINGS_SESSION_COOKIE_SECURE = 'true';
        removeSessionCookie(response);
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
        const { value } = response.getCookie('auth2');
        strictEqual(value, '');
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.domain, 'example.com');
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.httpOnly, false);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.path, '/foo');
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.sameSite, 'strict');
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.secure, true);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.maxAge, 0);
      });

    });

  });

});

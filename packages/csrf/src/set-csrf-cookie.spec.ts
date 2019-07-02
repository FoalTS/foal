// std
import { strictEqual } from 'assert';

// 3p
import { HttpResponse, HttpResponseOK } from '@foal/core';

// FoalTS
import { CSRF_DEFAULT_COOKIE_NAME, CSRF_DEFAULT_COOKIE_PATH } from './constants';
import { setCsrfCookie } from './set-csrf-cookie';

describe('setCsrfCookie', () => {

  let token: string;
  let response: HttpResponse;

  beforeEach(() => {
    response = new HttpResponseOK();
    token = 'xxx';
  });

  describe('should set a csrf cookie in the response', () => {

    describe('given no configuration option is provided', () => {

      beforeEach(() => setCsrfCookie(response, token));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(value, token);
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.domain, undefined);
      });

      it('with the proper "httpOnly" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.httpOnly, false);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.path, CSRF_DEFAULT_COOKIE_PATH);
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.secure, undefined);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie(CSRF_DEFAULT_COOKIE_NAME);
        strictEqual(options.maxAge, undefined);
      });

    });

    describe('given configuration options are provided', () => {

      beforeEach(() => {
        process.env.SETTINGS_CSRF_COOKIE_NAME = 'auth2';
        process.env.SETTINGS_CSRF_COOKIE_DOMAIN = 'example.com';
        process.env.SETTINGS_CSRF_COOKIE_PATH = '/foo';
        process.env.SETTINGS_CSRF_COOKIE_SAME_SITE = 'strict';
        process.env.SETTINGS_CSRF_COOKIE_SECURE = 'true';
        process.env.SETTINGS_CSRF_COOKIE_MAX_AGE = '36000';
        setCsrfCookie(response, token);
      });

      afterEach(() => {
        delete process.env.SETTINGS_CSRF_COOKIE_NAME;
        delete process.env.SETTINGS_CSRF_COOKIE_DOMAIN;
        delete process.env.SETTINGS_CSRF_COOKIE_PATH;
        delete process.env.SETTINGS_CSRF_COOKIE_SAME_SITE;
        delete process.env.SETTINGS_CSRF_COOKIE_SECURE;
        delete process.env.SETTINGS_CSRF_COOKIE_MAX_AGE;
      });

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie('auth2');
        strictEqual(value, token);
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
        strictEqual(options.maxAge, 36000);
      });

    });

  });

});

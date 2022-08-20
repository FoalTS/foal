// std
import { strictEqual } from 'assert';

// 3p
import { Config, Context } from '@foal/core';

// FoalTS
import { JWT_DEFAULT_CSRF_COOKIE_NAME } from '../constants';
import { getCsrfTokenFromCookie } from './get-csrf-token-from-cookie';

describe('getCsrfTokenFromCookie', () => {
  context('given the configuration "settings.jwt.csrf.cookie.name" is undefined', () => {
    it('should return the value of the default CSRF cookie.', () => {
      const token = '123';
      const request = {
        cookies: {
          [JWT_DEFAULT_CSRF_COOKIE_NAME]: token
        }
      } as Context['request'];

      const actualCsrfToken = getCsrfTokenFromCookie(request);
      const expectedCsrfToken = token;

      strictEqual(actualCsrfToken, expectedCsrfToken);
    });
  });

  context('given the configuration "settings.jwt.csrf.cookie.name" is defined', () => {

    afterEach(() => Config.remove('settings.jwt.csrf.cookie.name'));

    it('should return the value of the given CSRF cookie.', () => {
      const csrfCookieName = `${JWT_DEFAULT_CSRF_COOKIE_NAME}2`;
      Config.set('settings.jwt.csrf.cookie.name', csrfCookieName);

      const token = '123';
      const request = {
        cookies: {
          [csrfCookieName]: token
        }
      } as Context['request'];

      const actualCsrfToken = getCsrfTokenFromCookie(request);
      const expectedCsrfToken = token;

      strictEqual(actualCsrfToken, expectedCsrfToken);
    });
  });
})
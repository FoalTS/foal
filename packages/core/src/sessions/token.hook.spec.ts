import { deepStrictEqual, strictEqual } from 'assert';
import { Context, getHookFunction, isHttpResponseBadRequest, isHttpResponseUnauthorized, ServiceManager } from '../core';
import { Session } from './session';
import { SessionStore } from './session-store';
import { TokenOptional } from './token-optional.hook';
import { TokenRequired } from './token-required.hook';

export function testSuite(Token: typeof TokenRequired|typeof TokenOptional, required: boolean) {
  const user = { id: 1 };

  const fetchUser = async id => id === '1' ? user : null;

  class Store extends SessionStore {
    createAndSaveSession(sessionContent: object): Promise<Session> {
      throw new Error('Method not implemented.');
    }
    update(session: import('./session').Session): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    read(sessionID: string): Promise<Session> {
      throw new Error('Method not implemented.');
    }
    extendLifeTime(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

  }

  const hook = getHookFunction(Token({ store: Store }));

  const secret = 'my_secret';
  let services: ServiceManager;

  before(() => services = new ServiceManager());

  afterEach(() => delete process.env.SETTINGS_SESSION_SECRET);

  beforeEach(() => process.env.SETTINGS_SESSION_SECRET = secret);

  describe('should validate the request and', () => {

    describe('given options.cookie is false or not defined', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the Authorization header does not exist.', async () => {
          const ctx = new Context({ get(str: string) { return undefined; } });

          const response = await hook(ctx, services);
          if (!isHttpResponseBadRequest(response)) {
            throw new Error('Response should be an instance of HttpResponseBadRequest.');
          }
          deepStrictEqual(response.body, {
            code: 'invalid_request',
            description: 'Authorization header not found.'
          });
        });

      } else  {

        it('should let ctx.user equal undefined if the Authorization header does not exist.', async () => {
          const ctx = new Context({ get(str: string) { return undefined; } });

          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, undefined);
        });

      }

      it('should return an HttpResponseBadRequest object if the Authorization header does '
          + 'not use the Bearer scheme.', async () => {
        const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; } });

        const response = await hook(ctx, services);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('Response should be an instance of HttpResponseBadRequest.');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_request',
          description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.'
        });
      });

    });

    describe('given options.cookie is true', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the cookie does not exist.' , async () => {
          const hook = getHookFunction(Token({ store: Store, cookie: true }));

          const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });

          const response = await hook(ctx, services);
          if (!isHttpResponseBadRequest(response)) {
            throw new Error('Response should be an instance of HttpResponseBadRequest.');
          }
          deepStrictEqual(response.body, {
            code: 'invalid_request',
            description: 'Auth cookie not found.'
          });
        });

      } else {

        it('should let ctx.user equal undefined if the cookie does not exist.', async () => {
          const hook = getHookFunction(Token({ store: Store, cookie: true }));

          const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });

          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, undefined);
        });

      }

    });

  });

  describe('should verify the token and', () => {

    it('should return an HttpResponseUnauthorized object if the token is invalid.', async () => {
      const token = 'xxx';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid token'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid token"'
      );
    });

    describe('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response if the token is invalid.', async () => {
        const token = 'xxx';
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }
        deepStrictEqual(response.getCookies(), {});
      });

    });

    describe('given options.cookie is true', () => {

      xit('should remove the cookie in the repsonse if the token is invalid.');

    });

  });

  describe('should set Context.user', () => {

    // should throw if userId === undefined?

    describe('given options.fetchUser is not defined', () => {

      xit('with the used id (header).');

      xit('with the used id (cookie).');

      xit('with the used id (cookie with a custom name).');

    });

    describe('given options.fetchUser if defined', () => {

      xit('with the user retrieved from the database.');

      xit('OR return an HttpResponseUnauthorized object if no user could be retrieved from the database '
          + 'with the given user Id.');

    });

  });

  describe('should return a post-hook function that', () => {

    describe('given options.cookie is false or not defined', () => {

    });

    describe('given options.cookie is true', () => {

    });

  });
}

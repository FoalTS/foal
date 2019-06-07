import { deepStrictEqual, strictEqual } from 'assert';
import {
  Config, Context, getHookFunction, isHttpResponseBadRequest,
  isHttpResponseUnauthorized,
  ServiceManager
} from '../core';
import { Session } from './session';
import { SessionStore } from './session-store';
import { TokenOptional } from './token-optional.hook';
import { TokenRequired } from './token-required.hook';

export function testSuite(Token: typeof TokenRequired|typeof TokenOptional, required: boolean) {
  const user = { id: 1 };

  const fetchUser = async id => id === 1 ? user : null;

  class Store extends SessionStore {
    private sessions: Session[] = [];

    async createAndSaveSession(sessionContent: object): Promise<Session> {
      const sessionID = await this.generateSessionID();
      const session = new Session(sessionID, sessionContent, 0);
      this.sessions.push(session);
      return session;
    }
    update(session: Session): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async read(sessionID: string): Promise<Session> {
      const session = this.sessions.find(session => session.sessionID === sessionID);
      if (!session) {
        throw new Error('Not found'); // TODO: check this
      }
      return session;
    }
    extendLifeTime(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

    clear() {
      this.sessions = [];
    }
  }

  const hook = getHookFunction(Token({ store: Store }));

  const secret = 'my_secret';
  let services: ServiceManager;

  before(() => services = new ServiceManager());

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_SECRET;
    delete process.env.SETTINGS_SESSION_ID;
  });

  beforeEach(() => {
    process.env.SETTINGS_SESSION_SECRET = secret;
    services.get(Store).clear();
  });

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

      xit('should remove the cookie in the response if the token is invalid.', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const token = 'xxx';
        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            auth: token,
          }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }

        const { value, options } = response.getCookie('auth');
        strictEqual(value, '');
        deepStrictEqual(options, {
          domain: 'example.com',
          maxAge: 0,
          path: '/',
        });
      });

    });

  });

  describe('should set Context.user', () => {

    describe('given options.user is not defined', () => {

      it('with the used id (header).', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 36 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(response, undefined);

        strictEqual(ctx.user, 36);
      });

      it('with the used id (cookie).', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const session = await services.get(Store).createAndSaveSession({ userId: 35 });
        const token = session.getToken();

        const ctx = new Context({
          cookies: {
            auth: token
          },
          get(str: string) { return undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(response, undefined);

        strictEqual(ctx.user, 35);
      });

      it('with the used id (cookie with a custom name).', async () => {
        process.env.SETTINGS_SESSION_ID = 'auth2';
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const session = await services.get(Store).createAndSaveSession({ userId: 34 });
        const token = session.getToken();

        const ctx = new Context({
          cookies: {
            auth2: token
          },
          get(str: string) { return undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(response, undefined);

        strictEqual(ctx.user, 34);
      });

    });

    describe('given options.user is defined', () => {

      it('with the user retrieved from the database.', async () => {
        const hook = getHookFunction(Token({ store: Store, user: fetchUser }));

        const session = await services.get(Store).createAndSaveSession({ userId: 1 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(response, undefined);
        strictEqual(ctx.user, user);
      });

      it('OR return an HttpResponseUnauthorized object if no user could be retrieved from the database '
          + 'with the given user Id.', async () => {
        const hook = getHookFunction(Token({ store: Store, user: fetchUser }));

        const session = await services.get(Store).createAndSaveSession({ userId: 2 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_token',
          description: 'The token does not match any user.'
        });
        strictEqual(
          response.getHeader('WWW-Authenticate'),
          'error="invalid_token", error_description="The token does not match any user."'
        );
      });

    });

  });

  describe('should return a post-hook function that', () => {

    describe('given options.cookie is false or not defined', () => {

    });

    describe('given options.cookie is true', () => {

    });

  });
}

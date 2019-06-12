import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import {
  Context, getHookFunction, HttpResponseOK,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseUnauthorized,
  ServiceManager
} from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Session } from './session';
import { SessionStore } from './session-store';
import { TokenOptional } from './token-optional.hook';
import { TokenRequired } from './token-required.hook';

export function testSuite(Token: typeof TokenRequired|typeof TokenOptional, required: boolean) {
  const user = { id: 1 };

  const fetchUser = async id => id === 1 ? user : null;

  class Store extends SessionStore {
    updateCalledWith: Session|undefined = undefined;
    extendLifeTimeCalledWith: string|undefined = undefined;

    private sessions: Session[] = [];

    async clear(): Promise<void> {
      this.sessions = [];
    }
    async update(session: Session): Promise<void> {
      this.updateCalledWith = session;
    }
    destroy(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async extendLifeTime(sessionID: string): Promise<void> {
      this.extendLifeTimeCalledWith = sessionID;
    }
    cleanUpExpiredSessions(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async createAndSaveSession(sessionContent: object): Promise<Session> {
      const sessionID = await this.generateSessionID();
      const session = new Session(sessionID, sessionContent, Date.now());
      this.sessions.push(session);
      return session;
    }
    async read(sessionID: string): Promise<Session|undefined> {
      return this.sessions.find(session => session.sessionID === sessionID);
    }
  }

  const hook = getHookFunction(Token({ store: Store }));

  const secret = 'my_secret';
  let services: ServiceManager;

  before(() => services = new ServiceManager());

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_SECRET;
    delete process.env.SETTINGS_SESSION_COOKIE_NAME;
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

      it('should remove the cookie in the response if the token is invalid.', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const token = 'xxx';
        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token,
          }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, '');
        strictEqual(options.maxAge, 0);
      });

    });

  });

  describe('should verify the session ID and', () => {

    it('should return an HttpResponseUnauthorized object if no session matching the ID is found.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 22 });
      const token = session.getToken();

      await services.get(Store).clear();

      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'token invalid or expired'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="token invalid or expired"'
      );
    });

    describe('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response if no session matching the ID is found.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 23 });
        const token = session.getToken();

        await services.get(Store).clear();

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

      it('should remove the cookie in the response if no session matching the ID is found.', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const session = await services.get(Store).createAndSaveSession({ userId: 24 });
        const token = session.getToken();

        await services.get(Store).clear();

        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token,
          }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, '');
        strictEqual(options.maxAge, 0);
      });

    });

  });

  describe('should set Context.user', () => {

    describe('given options.user is not defined', () => {

      it('with the user id (header).', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 36 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(isHttpResponse(response), false);

        strictEqual(ctx.user, 36);
      });

      it('with the user id (cookie).', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const session = await services.get(Store).createAndSaveSession({ userId: 35 });
        const token = session.getToken();

        const ctx = new Context({
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token
          },
          get(str: string) { return undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(isHttpResponse(response), false);

        strictEqual(ctx.user, 35);
      });

      it('with the user id (cookie with a custom name).', async () => {
        process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';
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
        strictEqual(isHttpResponse(response), false);

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
        strictEqual(isHttpResponse(response), false);
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

    beforeEach(() => {
      services.get(Store).updateCalledWith = undefined;
      services.get(Store).extendLifeTimeCalledWith = undefined;
    });

    it('should update the session and extend its lifetime if it has been modified.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 47 });
      const token = session.getToken();

      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const postHookFunction = await hook(ctx, services);
      if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
        throw new Error('The hook should return a post hook function');
      }
      if (!ctx.session) {
        throw new Error('ctx.session should be defined');
      }
      ctx.session.set('something', 1); // set "isModified" to "true"
      await postHookFunction(ctx, services, new HttpResponseOK());

      strictEqual(services.get(Store).updateCalledWith, ctx.session);
      strictEqual(services.get(Store).extendLifeTimeCalledWith, undefined);
    });

    it('should extend the session lifetime if it has not been modified.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 48 });
      const token = session.getToken();

      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const postHookFunction = await hook(ctx, services);
      if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
        throw new Error('The hook should return a post hook function');
      }
      if (!ctx.session) {
        throw new Error('ctx.session should be defined');
      }
      // Do not set "isModified" to "true"
      await postHookFunction(ctx, services, new HttpResponseOK());

      strictEqual(services.get(Store).updateCalledWith, undefined);
      strictEqual(services.get(Store).extendLifeTimeCalledWith, session.sessionID);
    });

    describe('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 48 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const postHookFunction = await hook(ctx, services);
        if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
          throw new Error('The hook should return a post hook function');
        }
        if (!ctx.session) {
          throw new Error('ctx.session should be defined');
        }
        const response = new HttpResponseOK();
        await postHookFunction(ctx, services, response);

        deepStrictEqual(response.getCookies(), {});
      });

    });

    describe('given options.cookie is true', () => {

      it('should set a cookie in the response with the token to extend its lifetime on the client.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 48 });
        const token = session.getToken();

        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: session.getToken()
          }
        });

        const postHookFunction = await hook(ctx, services);
        if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
          throw new Error('The hook should return a post hook function');
        }
        if (!ctx.session) {
          throw new Error('ctx.session should be defined');
        }
        const response = new HttpResponseOK();
        await postHookFunction(ctx, services, response);

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, session.getToken());
        deepStrictEqual(options.maxAge, SessionStore.getExpirationTimeouts().inactivity);
      });

    });

  });
}

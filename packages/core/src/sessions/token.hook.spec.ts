// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import {
  ConfigNotFoundError,
  Context,
  getApiComponents,
  getApiResponses,
  getApiSecurity,
  getHookFunction,
  HttpResponseOK,
  IApiComponents,
  IApiSecurityRequirement,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager
} from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Session } from './session';
import { SessionOptions, SessionStore } from './session-store';
import { TokenOptional } from './token-optional.hook';
import { TokenRequired } from './token-required.hook';

export function testSuite(Token: typeof TokenRequired|typeof TokenOptional, required: boolean) {
  const user = { id: 1 };

  const fetchUser = async (id: number|string) => id === 1 ? user : null;

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
    async destroy(sessionID: string): Promise<void> {}
    async extendLifeTime(sessionID: string): Promise<void> {
      this.extendLifeTimeCalledWith = sessionID;
    }
    cleanUpExpiredSessions(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
      const sessionID = await this.generateSessionID();
      const session = new Session(this, {
        content: sessionContent,
        createdAt: Date.now(),
        flash: {},
        id: sessionID,
        userId: options.userId
      });
      this.sessions.push(session);
      return session;
    }
    async read(sessionID: string): Promise<Session|undefined> {
      return this.sessions.find(session => session.getState().id === sessionID);
    }
  }

  const hook = getHookFunction(Token({ store: Store }));

  let services: ServiceManager;

  before(() => services = new ServiceManager());

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_COOKIE_NAME;
    delete process.env.SETTINGS_SESSION_STORE;
  });

  beforeEach(() => {
    services.get(Store).clear();
  });

  describe('when no session store class is provided as option', () => {

    it('should throw an error if the configuration value settings.session.store is empty.', async () => {
      const hook = getHookFunction(Token({}));

      const ctx = new Context({});

      try {
        await hook(ctx, services);
        throw new Error('The hook should have thrown an error.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.session.store');
      }
    });

    // TODO: improve this test. This code actually tests that no error is thrown but not that
    // the ConcreteSessionStore is assigned to options.store.
    it('should use the session store package provided in settings.session.store.', async () => {
      process.env.SETTINGS_SESSION_STORE = '@foal/internal-test';

      const hook = getHookFunction(Token({}));

      const ctx = new Context({});

      try {
        await hook(ctx, services);
        throw new Error('The hook should have thrown an error.');
      } catch (error) {
        strictEqual(
          error.message,
          'ctx.request.get is not a function'
        );
      }
    });

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

        it('should return an HttpResponseRedirect object if the Authorization header does not exist'
          + ' (options.redirectTo is defined).', async () => {
          const ctx = new Context({ get(str: string) { return undefined; } });

          const hook = getHookFunction(Token({ store: Store, redirectTo: '/foo' }));

          const response = await hook(ctx, services);
          if (!isHttpResponseRedirect(response)) {
            throw new Error('Response should be an instance of HttpResponseRedirect.');
          }
          strictEqual(response.path, '/foo');
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

      it('should return an HttpResponseBadRedirect object if the Authorization header does '
          + 'not use the Bearer scheme (options.redirectTo is defined).', async () => {
        const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; } });

        const hook = getHookFunction(Token({ store: Store, redirectTo: '/foo' }));

        const response = await hook(ctx, services);

        if (!isHttpResponseRedirect(response)) {
          throw new Error('Response should be an instance of HttpResponseRedirect.');
        }
        strictEqual(response.path, '/foo');
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
            description: 'Session cookie not found.'
          });
        });

        it('should return an HttpResponseRedirect object if the cookie does not exist'
            + ' (options.redirectTo is defined).' , async () => {
          const hook = getHookFunction(Token({ store: Store, cookie: true, redirectTo: '/foo' }));

          const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });

          const response = await hook(ctx, services);
          if (!isHttpResponseRedirect(response)) {
            throw new Error('Response should be an instance of HttpResponseRedirect.');
          }
          strictEqual(response.path, '/foo');
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

  describe('should verify the session ID and', () => {

    it('should return an HttpResponseUnauthorized object if no session matching the ID is found.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 2 });
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

    it('should return an HttpResponseRedirect object if no session matching the ID is found'
        + ' (options.redirectTo is defined).', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 2 });
      const token = session.getToken();

      await services.get(Store).clear();

      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const hook = getHookFunction(Token({ store: Store, redirectTo: '/foo' }));

      const response = await hook(ctx, services);
      if (!isHttpResponseRedirect(response)) {
        throw new Error('response should be instance of HttpResponseRedirect');
      }
      strictEqual(response.path, '/foo');
    });

    describe('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response if no session matching the ID is found.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 3 });
        const token = session.getToken();

        await services.get(Store).clear();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponse(response)) {
          throw new Error('response should be instance of HttpResponse');
        }
        deepStrictEqual(response.getCookies(), {});
      });

    });

    describe('given options.cookie is true', () => {

      it('should remove the cookie in the response if no session matching the ID is found.', async () => {
        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const session = await services.get(Store).createAndSaveSession({ userId: 4 });
        const token = session.getToken();

        await services.get(Store).clear();

        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token,
          }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponse(response)) {
          throw new Error('response should be instance of HttpResponse');
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
        const session = await services.get(Store).createAndSaveSession({ userId: 6 });
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

        const session = await services.get(Store).createAndSaveSession({ userId: 5 });
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

        const session = await services.get(Store).createAndSaveSession({ userId: 4 });
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

      it('with the user retrieved from the database (userId is a number).', async () => {
        const fetchUser = async (id: number|string) => id === 1 ? user : null;
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

      it('with the user retrieved from the database (userId is a string).', async () => {
        const fetchUser = async (id: number|string) => id === '1' ? user : null;
        const hook = getHookFunction(Token({ store: Store, user: fetchUser }));

        const session = await services.get(Store).createAndSaveSession({ userId: '1' });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        strictEqual(isHttpResponse(response), false);
        strictEqual(ctx.user, user);
      });

      it('or throw an Error if the session userId is not of type "string" or "number".', async () => {
        const hook = getHookFunction(Token({ store: Store, user: fetchUser }));

        const session = await services.get(Store).createAndSaveSession({ userId: null });
        const sessionID = session.getState().id;
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        try {
          await hook(ctx, services);
          throw new Error('The hook should have thrown an error.');
        } catch (error) {
          strictEqual(
            error.message,
            `The "userId" value of the session ${sessionID} must be a string or a number. Got "object".`
          );
        }
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

      it('OR return an HttpResponseUnauthorized object if no user could be retrieved from the database '
          + 'with the given user Id (options.redirectTo is defined).', async () => {
        const hook = getHookFunction(Token({ store: Store, user: fetchUser, redirectTo: '/foo' }));

        const session = await services.get(Store).createAndSaveSession({ userId: 2 });
        const token = session.getToken();

        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

        const response = await hook(ctx, services);
        if (!isHttpResponseRedirect(response)) {
          throw new Error('response should be instance of HttpResponseRedirect');
        }
        strictEqual(response.path, '/foo');
      });

    });

  });

  describe('should return a post-hook function that', () => {

    beforeEach(() => {
      services.get(Store).updateCalledWith = undefined;
      services.get(Store).extendLifeTimeCalledWith = undefined;
    });

    it('should update the session and extend its lifetime if it has been modified.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 7 });
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
      await postHookFunction(new HttpResponseOK());

      strictEqual(services.get(Store).updateCalledWith, ctx.session);
      strictEqual(services.get(Store).extendLifeTimeCalledWith, undefined);
    });

    it('should extend the session lifetime if it has not been modified.', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 8 });
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
      await postHookFunction(new HttpResponseOK());

      strictEqual(services.get(Store).updateCalledWith, undefined);
      strictEqual(services.get(Store).extendLifeTimeCalledWith, session.getState().id);
    });

    it('should not update the session or extend its lifetime if session.isDestroyed is true'
      + ' (isModified === true).', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 7 });
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
        await ctx.session.destroy();
        await postHookFunction(new HttpResponseOK());

        strictEqual(services.get(Store).updateCalledWith, undefined);
        strictEqual(services.get(Store).extendLifeTimeCalledWith, undefined);
      }
    );

    it('should not extend the session lifetime if session.isDestroyed is true (isModified === false).', async () => {
      const session = await services.get(Store).createAndSaveSession({ userId: 8 });
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
      await ctx.session.destroy();
      await postHookFunction(new HttpResponseOK());

      strictEqual(services.get(Store).updateCalledWith, undefined);
      strictEqual(services.get(Store).extendLifeTimeCalledWith, undefined);
    });

    describe('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 8 });
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
        await postHookFunction(response);

        deepStrictEqual(response.getCookies(), {});
      });

    });

    describe('given options.cookie is true', () => {

      it('should set a cookie in the response with the token to extend its lifetime on the client.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 8 });
        const token = session.getToken();

        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token
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
        await postHookFunction(response);

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, session.getToken());
        deepStrictEqual(options.maxAge, SessionStore.getExpirationTimeouts().inactivity);
      });

      it('should remove the session cookie if session.isDestroyed is true.', async () => {
        const session = await services.get(Store).createAndSaveSession({ userId: 8 });
        const token = session.getToken();

        const hook = getHookFunction(Token({ store: Store, cookie: true }));

        const ctx = new Context({
          get(str: string) { return undefined; },
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token
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
        await ctx.session.destroy();
        await postHookFunction(response);

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, '');
        deepStrictEqual(options.maxAge, 0);
      });

    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @Token({ store: Store, openapi: false })
      class Foobar {}

      strictEqual(getApiSecurity(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
      deepStrictEqual(getApiComponents(Foobar, new Foobar()), {});
    });

    it('with the proper security scheme (cookie).', () => {
      @Token({ store: Store, cookie: true })
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          cookieAuth: {
            in: 'cookie',
            name: SESSION_DEFAULT_COOKIE_NAME,
            type: 'apiKey',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    it('with the proper security scheme (cookie) (cookie name different).', () => {
      process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';
      @Token({ store: Store, cookie: true })
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          cookieAuth: {
            in: 'cookie',
            name: 'auth2',
            type: 'apiKey',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    it('with the proper security scheme (no cookie).', () => {
      @Token({ store: Store })
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          bearerAuth: {
            scheme: 'bearer',
            type: 'http',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    if (required) {

      it('with the proper security requirement (cookie).', () => {
        @Token({ store: Store, cookie: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { cookieAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      it('with the proper security requirement (no cookie).', () => {
        @Token({ store: Store })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { bearerAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      it('with the proper API responses.', () => {
        @Token({ store: Store })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is missing or invalid.' }
        });
      });

    } else {

      it('with no security requirement (cookie).', () => {
        @Token({ store: Store, cookie: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      it('with no security requirement (no cookie).', () => {
        @Token({ store: Store })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      it('with the proper API responses.', () => {
        @Token({ store: Store })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is invalid.' }
        });
      });

    }

  });

}

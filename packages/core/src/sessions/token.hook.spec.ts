// std
import { deepStrictEqual, doesNotReject, rejects, strictEqual } from 'assert';

// FoalTS
import {
  ConfigNotFoundError,
  Context,
  getApiComponents,
  getApiResponses,
  getApiSecurity,
  getHookFunction,
  HookFunction,
  HttpResponseOK,
  IApiComponents,
  IApiSecurityRequirement,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager
} from '../core';
import {
  SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
  SESSION_DEFAULT_COOKIE_NAME,
  SESSION_DEFAULT_INACTIVITY_TIMEOUT
} from './constants';
import { readSession } from './read-session';
import { Session } from './session';
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';
import { TokenOptional } from './token-optional.hook';
import { TokenRequired } from './token-required.hook';

export function testSuite(Token: typeof TokenRequired|typeof TokenOptional, required: boolean) {

  const anonymousSessionID = 'sjqkfhehlkajazeincudbuqslnd';
  const authenticatedSessionID = 'jdhzialoenfurhhfbghdfjh';
  const userId = 1;

  let ctx: Context;
  let hook: HookFunction;
  let services: ServiceManager;

  class Store extends SessionStore {
    updateCalledWith: { state: SessionState, maxInactivity: number } | undefined;
    sessions: SessionState[] = [
      // Anonymous session
      {
        content: { foo: 'bar' },
        createdAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_ABSOLUTE_TIMEOUT / 2),
        flash: {},
        id: anonymousSessionID,
        // The differenece is required in order to test that the session and cookie lifetime are extended.
        updatedAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_INACTIVITY_TIMEOUT / 2),
        userId: null,
      },
      // Sessions with a user ID
      {
        content: { foo: 'bar' },
        createdAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_ABSOLUTE_TIMEOUT / 3),
        flash: {},
        id: authenticatedSessionID,
        // The differenece is required in order to test that the session and cookie lifetime are extended.
        updatedAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_INACTIVITY_TIMEOUT / 3),
        userId,
      }
    ];

    save(state: SessionState, maxInactivity: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async read(id: string): Promise<SessionState | null> {
      return this.sessions.find(state => state.id === id) || null;
    }
    async update(state: SessionState, maxInactivity: number): Promise<void> {
      this.updateCalledWith = { state, maxInactivity };
    }
    async destroy(id: string): Promise<void> {}
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {}
  }

  function createContext(headers: { [key: string]: string } = {}, cookies: { [key: string]: string } = {}) {
    return new Context({
      get(key: string) { return headers[key]; },
      cookies,
    });
  }

  beforeEach(() => {
    ctx = createContext();
    hook = getHookFunction(Token({ store: Store }));
    services = new ServiceManager();
  });

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_COOKIE_NAME;
    delete process.env.SETTINGS_SESSION_STORE;
  });

  context('given no session store class is provided as option', () => {

    beforeEach(() => hook = getHookFunction(Token({})));

    it('should throw an error if the configuration value settings.session.store is empty.', () => {
      return rejects(
        () => hook(ctx, services),
        new ConfigNotFoundError('settings.session.store')
      );
    });

    it('should use the session store package provided in settings.session.store.', () => {
      process.env.SETTINGS_SESSION_STORE = '@foal/internal-test';

      return doesNotReject(() => hook(ctx, services));
    });

  });

  describe('should validate the request and', () => {

    context('given options.cookie is false or not defined', () => {

      if (!required) {
        it('should let ctx.user equal undefined if the Authorization header does not exist.', async () => {
          const response = await hook(ctx, services);

          strictEqual(isHttpResponse(response), false);
          strictEqual(ctx.user, undefined);
        });
      }

      context('given options.redirectTo is not defined', () => {

        if (required) {
          it('should return an HttpResponseBadRequest object if the Authorization header does not exist.', async () => {
            const response = await hook(ctx, services);
            if (!isHttpResponseBadRequest(response)) {
              throw new Error('Response should be an instance of HttpResponseBadRequest.');
            }

            deepStrictEqual(response.body, {
              code: 'invalid_request',
              description: 'Authorization header not found.'
            });
          });
        }

        it('should return an HttpResponseBadRequest object if the Authorization header does '
            + 'not use the Bearer scheme.', async () => {
          const ctx = createContext({ Authorization: 'Basic hello' });

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

      context('given options.redirectTo is defined', () => {

        beforeEach(() => hook = getHookFunction(Token({ store: Store, redirectTo: '/foo' })));

        if (required) {
          it('should return an HttpResponseRedirect object if the Authorization header does not exist.', async () => {
            const response = await hook(ctx, services);
            if (!isHttpResponseRedirect(response)) {
              throw new Error('Response should be an instance of HttpResponseRedirect.');
            }

            strictEqual(response.path, '/foo');
          });
        }

        it('should return an HttpResponseBadRedirect object if the Authorization header does '
            + 'not use the Bearer scheme.', async () => {
          const ctx = createContext({ Authorization: 'Basic hello' });

          const response = await hook(ctx, services);
          if (!isHttpResponseRedirect(response)) {
            throw new Error('Response should be an instance of HttpResponseRedirect.');
          }

          strictEqual(response.path, '/foo');
        });

      });

    });

    context('given options.cookie is true', () => {

      beforeEach(() => hook = getHookFunction(Token({ store: Store, cookie: true })));

      if (!required) {
        it('should let ctx.user equal undefined if the cookie does not exist.', async () => {
          const response = await hook(ctx, services);

          strictEqual(isHttpResponse(response), false);
          strictEqual(ctx.user, undefined);
        });
      }

      context('given options.redirectTo is not defined', () => {

        if (required) {
          it('should return an HttpResponseBadRequest object if the cookie does not exist.' , async () => {
            const response = await hook(ctx, services);
            if (!isHttpResponseBadRequest(response)) {
              throw new Error('Response should be an instance of HttpResponseBadRequest.');
            }

            deepStrictEqual(response.body, {
              code: 'invalid_request',
              description: 'Session cookie not found.'
            });
          });
        }

      });

      context('given options.redirectTo is defined', () => {

        beforeEach(() => hook = getHookFunction(Token({ store: Store, cookie: true, redirectTo: '/foo' })));

        if (required) {
          it('should return an HttpResponseRedirect object if the cookie does not exist.', async () => {
            const response = await hook(ctx, services);
            if (!isHttpResponseRedirect(response)) {
              throw new Error('Response should be an instance of HttpResponseRedirect.');
            }

            strictEqual(response.path, '/foo');
          });
        }

      });

    });

  });

  describe('should verify the session ID and', () => {

    beforeEach(() => ctx = createContext({ Authorization: 'Bearer xxx' }));

    context('given options.redirectTo not defined', () => {

      it('should return an HttpResponseUnauthorized object if no session matching the ID is found.', async () => {
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

    });

    context('given options.redirectTo is defined', () => {

      beforeEach(() => hook = getHookFunction(Token({ store: Store, redirectTo: '/foo' })));

      it('should return an HttpResponseRedirect object if no session matching the ID is found.', async () => {
        const response = await hook(ctx, services);
        if (!isHttpResponseRedirect(response)) {
          throw new Error('response should be instance of HttpResponseRedirect');
        }

        strictEqual(response.path, '/foo');
      });

    });

    context('given options.cookie is false or not defined', () => {

      it('should not set a cookie in the response if no session matching the ID is found.', async () => {
        const response = await hook(ctx, services);
        if (!isHttpResponse(response)) {
          throw new Error('response should be instance of HttpResponse');
        }
        deepStrictEqual(response.getCookies(), {});
      });

    });

    context('given options.cookie is true', () => {

      beforeEach(() => hook = getHookFunction(Token({ store: Store, cookie: true })));

      it('should remove the cookie in the response if no session matching the ID is found.', async () => {
        ctx = createContext(
          {},
          {
            [SESSION_DEFAULT_COOKIE_NAME]: 'xxx',
          },
        );

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

  describe('should set Context.session', () => {

    afterEach(() => delete process.env.SETTINGS_SESSION_COOKIE_NAME);

    it('with the session.', async () => {
      ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`});

      await hook(ctx, services);

      const session = ctx.session;
      if (!session) {
        throw new Error('No session found at Context.session');
      }

      strictEqual(session.getToken(), anonymousSessionID);
      strictEqual(session.get('foo'), 'bar');
    });

    // This test might be put in a better place.
    it('with the session (custom cookie name).', async () => {
      process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';

      ctx = createContext({}, { auth2: anonymousSessionID });
      hook = getHookFunction(Token({ store: Store, cookie: true }));

      await hook(ctx, services);

      const session = ctx.session;
      if (!session) {
        throw new Error('No session found at Context.session');
      }

      strictEqual(session.getToken(), anonymousSessionID);
      strictEqual(session.get('foo'), 'bar');
    });

  });

  describe('should set Context.user', () => {

    context('given the session is anonymous (no user ID)', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`}));

      it('with the undefined value.', async () => {
        const response = await hook(ctx, services);
        strictEqual(isHttpResponse(response), false);

        strictEqual(ctx.user, undefined);
      });

      // ...

    });

    context('given the session has a user ID', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${authenticatedSessionID}`}));

      context('given options.user is not defined', () => {

        it('with the undefined value.', async () => {
          const response = await hook(ctx, services);
          strictEqual(isHttpResponse(response), false);

          strictEqual(ctx.user, undefined);
        });

      });

      context('given options.user is defined', () => {

        const user = { id: userId };

        beforeEach(() => {
          const fetchUser = async (id: number|string) => id === userId ? user : undefined;
          hook = getHookFunction(Token({ store: Store, user: fetchUser }));
        });

        it('with the user retrieved from the function options.user if it returns a user.', async () => {
          const response = await hook(ctx, services);

          strictEqual(isHttpResponse(response), false);
          strictEqual(ctx.user, user);
        });

        context('given options.redirectTo is not defined', () => {

          it(
            'with the undefined value and should return an HttpResponseUnauthorized object'
            + ' if the function options.user returns null.',
            async () => {
              const fetchUser = async (id: number|string) => undefined;
              hook = getHookFunction(Token({ store: Store, user: fetchUser }));

              const response = await hook(ctx, services);

              strictEqual(ctx.user, undefined);

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
            }
          );

        });

        context('given options.redirectTo is defined', () => {

          it(
            'with the null value and should return an HttpResponseRedirect object'
            + ' if the function options.user returns null.',
            async () => {
              const fetchUser = async (id: number|string) => undefined;
              hook = getHookFunction(Token({ store: Store, user: fetchUser, redirectTo: '/foo' }));

              const response = await hook(ctx, services);

              strictEqual(ctx.user, undefined);

              if (!isHttpResponseRedirect(response)) {
                throw new Error('response should be instance of HttpResponseRedirect');
              }
              strictEqual(response.path, '/foo');
            }
          );

        });

      });

    });

  });

  describe('should return a post-hook function that', () => {

    context('given the ctx.session has been set by the hook and has not been overridden in the controller', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`}));

      postHookTestHook(async () => {});

    });

    context('given the ctx.session has been set by the hook and has been overridden in the controller', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`}));

      postHookTestHook(async () => readSession(services.get(Store), authenticatedSessionID));

    });

    if (!required) {
      context('given the ctx.session has not been set by the hook and has been set in the controller', () => {

        beforeEach(() => ctx = createContext());

        postHookTestHook(async () => readSession(services.get(Store), authenticatedSessionID));

      });
    }

    function postHookTestHook(getSession: () => Promise<Session|null|void>) {

      context('given the session has been destroyed', () => {

        it('should not throw an error trying to save the session', async () => {
            const postHookFunction = await hook(ctx, services);
            if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
              throw new Error('The hook should return a post hook function');
            }
            const session = await getSession();
            if (session) {
              ctx.session = session;
            }
            if (!ctx.session) {
              throw new Error('ctx.session should be defined');
            }

            await ctx.session.destroy();

            return doesNotReject(() => postHookFunction(new HttpResponseOK()));
          }
        );

        context('given options.cookie is false or not defined', () => {

          it(
            'should not remove a session cookie in the response (it can belongs to another application).',
            async () => {
              const postHookFunction = await hook(ctx, services);
              if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
                throw new Error('The hook should return a post hook function');
              }
              const session = await getSession();
              if (session) {
                ctx.session = session;
              }
              if (!ctx.session) {
                throw new Error('ctx.session should be defined');
              }

              const response = new HttpResponseOK();
              await ctx.session.destroy();

              await postHookFunction(response);

              deepStrictEqual(response.getCookies(), {});
            }
          );

        });

        context('given options.cookie is true', () => {

          beforeEach(() => {
            hook = getHookFunction(Token({ store: Store, cookie: true }));
            const token = ctx.request.get('Authorization');
            if (token) {
              ctx = createContext(
                {},
                {
                  [SESSION_DEFAULT_COOKIE_NAME]: token.split('Bearer ')[1]
                },
              );
            } else {
              ctx = createContext();
            }
          });

          it('should remove the session cookie.', async () => {
            const postHookFunction = await hook(ctx, services);
            if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
              throw new Error('The hook should return a post hook function');
            }
            const session = await getSession();
            if (session) {
              ctx.session = session;
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

      context('given the session has not been destroyed', () => {

        it('should commit the session.', async () => {
          const postHookFunction = await hook(ctx, services);
          if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
            throw new Error('The hook should return a post hook function');
          }
          const session = await getSession();
          if (session) {
            ctx.session = session;
          }
          if (!ctx.session) {
            throw new Error('ctx.session should be defined');
          }

          await postHookFunction(new HttpResponseOK());

          // tslint:disable-next-line
          strictEqual(services.get(Store).updateCalledWith?.state.id, ctx.session.getToken());
        });

        context('given options.cookie is false or not defined', () => {

          it('should not set a cookie in the response.', async () => {
            const postHookFunction = await hook(ctx, services);
            if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
              throw new Error('The hook should return a post hook function');
            }
            const session = await getSession();
            if (session) {
              ctx.session = session;
            }
            if (!ctx.session) {
              throw new Error('ctx.session should be defined');
            }

            const response = new HttpResponseOK();
            await postHookFunction(response);

            deepStrictEqual(response.getCookies(), {});
          });

        });

        context('given options.cookie is true', () => {

          beforeEach(() => {
            hook = getHookFunction(Token({ store: Store, cookie: true }));
            const token = ctx.request.get('Authorization');
            if (token) {
              ctx = createContext(
                {},
                {
                  [SESSION_DEFAULT_COOKIE_NAME]: token.split('Bearer ')[1]
                },
              );
            } else {
              ctx = createContext();
            }
          });

          it('should set a cookie in the response with the session to extend its lifetime on the client.', async () => {
            const postHookFunction = await hook(ctx, services);
            if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
              throw new Error('The hook should return a post hook function');
            }
            const session = await getSession();
            if (session) {
              ctx.session = session;
            }
            if (!ctx.session) {
              throw new Error('ctx.session should be defined');
            }

            const response = new HttpResponseOK();
            await postHookFunction(response);

            const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
            strictEqual(value, ctx.session.getToken());
            deepStrictEqual(options.expires, new Date(ctx.session.expirationTime * 1000));
          });

        });

      });

    }

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

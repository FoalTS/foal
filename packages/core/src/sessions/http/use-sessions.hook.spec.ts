// std
import { deepStrictEqual, doesNotReject, rejects, strictEqual } from 'assert';
import { mock } from 'node:test';

// FoalTS
import {
  Config,
  ConfigNotFoundError,
  Context,
  getApiComponents,
  getApiResponses,
  getApiSecurity,
  getHookFunction,
  HookFunction,
  HttpMethod,
  HttpResponseInternalServerError,
  HttpResponseOK,
  IApiComponents,
  IApiSecurityRequirement,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseForbidden,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager,
  Logger,
} from '../../core';
import {
  SESSION_DEFAULT_COOKIE_NAME,
  SESSION_USER_COOKIE_NAME
} from './constants';
import {
  SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
  SESSION_DEFAULT_INACTIVITY_TIMEOUT,
  readSession,
  Session,
  SessionState,
  SessionStore,
} from '../core';
import { UseSessions } from './use-sessions.hook';

describe('UseSessions', () => {

  const anonymousSessionID = 'anonymousSessionIDxxxxxx';
  const authenticatedSessionID = 'authenticatedSessionIDxxxxxx';
  const csrfSessionID = 'csrfSessionIDxxxxxx';
  const csrfToken = 'csrfxxx';
  const incorrectCsrfToken = 'csrfyyy';
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
      },
      // Session with CSRF
      {
        content: { csrfToken },
        createdAt: Math.trunc(Date.now() / 1000),
        flash: {},
        id: csrfSessionID,
        updatedAt: Math.trunc(Date.now() / 1000),
        userId: null,
      },
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

  function createContext(
    headers: { [key: string]: string } = {},
    cookies: { [key: string]: string } = {},
    body: { [key: string]: string } = {},
    // Do not use GET, HEAD or OPTIONS as default (CSRF tests).
    method: HttpMethod = 'POST',
  ) {
    return new Context({
      get(key: string) { return headers[key]; },
      body,
      cookies,
      method,
    });
  }

  beforeEach(() => {
    ctx = createContext();
    hook = getHookFunction(UseSessions({ store: Store }));
    services = new ServiceManager();
  });

  afterEach(() => {
    Config.remove('settings.session.cookie.name');
    Config.remove('settings.session.store');
  });

  context('given no session store class is provided as option', () => {

    beforeEach(() => hook = getHookFunction(UseSessions({})));

    it('should throw an error if the configuration value settings.session.store is empty.', () => {
      return rejects(
        async () => hook(ctx, services),
        new ConfigNotFoundError('settings.session.store')
      );
    });

    it('should use the session store package provided in settings.session.store.', () => {
      Config.set('settings.session.store', 'mock-module');

      return doesNotReject(async () => hook(ctx, services));
    });

  });

  describe('should validate the request and', () => {

    context('given options.cookie is false or not defined', () => {

      context('given the Authorization header does not exist', () => {

        context('given options.required is false or not defined', () => {

          it('should not return an HttpResponse.', async () => {
            const response = await hook(ctx, services);

            strictEqual(isHttpResponse(response), false);
          });

          it('should let ctx.user equal null.', async () => {
            await hook(ctx, services);

            strictEqual(ctx.user, null);
          });

          context('given options.create is false or undefined', async () => {

            it('should let ctx.session equal null.', async () => {
              await hook(ctx, services);

              strictEqual(ctx.session, null);
            });

          });

          context('given options.create is true', async () => {

            beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, create: true })));

            it('should create a new session and assign it to ctx.session.', async () => {
              await hook(ctx, services);

              if (!(ctx.session instanceof Session)) {
                throw new Error('A new session should have been assigned to ctx.session.');
              }
            });

          });

        });

        context('given options.required is true', () => {

          beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, required: true })));

          context('given options.redirectTo is not defined', () => {

            it('should return an HttpResponseBadRequest object.', async () => {
              const response = await hook(ctx, services);
              if (!isHttpResponseBadRequest(response)) {
                throw new Error('Response should be an instance of HttpResponseBadRequest.');
              }

              deepStrictEqual(response.body, {
                code: 'invalid_request',
                description: 'Authorization header not found.'
              });
            });

          });

          context('given options.redirectTo is defined', () => {

            beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, required: true, redirectTo: '/foo' })));

            it('should return an HttpResponseRedirect object.', async () => {
              const response = await hook(ctx, services);
              if (!isHttpResponseRedirect(response)) {
                throw new Error('Response should be an instance of HttpResponseRedirect.');
              }

              strictEqual(response.path, '/foo');
            });

          });

        });

      });

      context('given the Authorization exists but does not use the Bearer scheme', () => {

        context('given options.redirectTo is not defined', () => {

          it('should return an HttpResponseBadRequest object.', async () => {
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

          beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, redirectTo: '/foo' })));

          it('should return an HttpResponseBadRedirect object.', async () => {
            const ctx = createContext({ Authorization: 'Basic hello' });

            const response = await hook(ctx, services);
            if (!isHttpResponseRedirect(response)) {
              throw new Error('Response should be an instance of HttpResponseRedirect.');
            }

            strictEqual(response.path, '/foo');
          });

        });

      });

    });

    context('given options.cookie is true', () => {

      beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, cookie: true })));

      context('given the cookie does not exist', () => {

        context('given options.required is false or not defined', () => {

          it('should not return an HttpResponse.', async () => {
            const response = await hook(ctx, services);

            strictEqual(isHttpResponse(response), false);
          });

          it('should let ctx.user equal null.', async () => {
            await hook(ctx, services);

            strictEqual(ctx.user, null);
          });

          context('given options.create is not defined', async () => {

            it('should create a new session and assign it to ctx.session.', async () => {
              await hook(ctx, services);

              if (!(ctx.session instanceof Session)) {
                throw new Error('A new session should have been assigned to ctx.session.');
              }
            });

          });

          context('given options.create is false', async () => {

            beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, cookie: true, create: false })));

            it('should let ctx.session equal null.', async () => {
              await hook(ctx, services);

              strictEqual(ctx.session, null);
            });

          });

          context('given options.create is true', async () => {

            beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, cookie: true, create: true })));

            it('should create a new session and assign it to ctx.session.', async () => {
              await hook(ctx, services);

              if (!(ctx.session instanceof Session)) {
                throw new Error('A new session should have been assigned to ctx.session.');
              }
            });

          });

        });

        context('given options.required is true', () => {

          beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, cookie: true, required: true })));

          context('given options.redirectTo is not defined', () => {

            it('should return an HttpResponseBadRequest object.' , async () => {
              const response = await hook(ctx, services);
              if (!isHttpResponseBadRequest(response)) {
                throw new Error('Response should be an instance of HttpResponseBadRequest.');
              }

              deepStrictEqual(response.body, {
                code: 'invalid_request',
                description: 'Session cookie not found.'
              });
            });

          });

          context('given options.redirectTo is defined', () => {

            beforeEach(() => hook = getHookFunction(UseSessions({
              cookie: true,
              redirectTo: '/foo',
              required: true,
              store: Store,
            })));

            it('should return an HttpResponseRedirect object.', async () => {
              const response = await hook(ctx, services);
              if (!isHttpResponseRedirect(response)) {
                throw new Error('Response should be an instance of HttpResponseRedirect.');
              }

              strictEqual(response.path, '/foo');
            });

          });

        });

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

      beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, redirectTo: '/foo' })));

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

    context('given options.cookie is true and no session matching the ID is found', () => {

      beforeEach(() => {
        hook = getHookFunction(UseSessions({ store: Store, cookie: true }));
        ctx = createContext(
          {},
          {
            [SESSION_DEFAULT_COOKIE_NAME]: 'xxx',
          },
        );
      });

      it('should remove the session cookie.', async () => {
        const response = await hook(ctx, services);
        if (!isHttpResponse(response)) {
          throw new Error('response should be instance of HttpResponse');
        }

        const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, '');
        strictEqual(options.maxAge, 0);
      });

      context('given userCookie is defined', () => {

        beforeEach(() => {
          hook = getHookFunction(UseSessions({ store: Store, cookie: true, userCookie: () => '' }));
        });

        it('should remove the "user" cookie', async () => {
          const response = await hook(ctx, services);
          if (!isHttpResponse(response)) {
            throw new Error('response should be instance of HttpResponse');
          }

          const { value, options } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(value, '');
          strictEqual(options.maxAge, 0);
        });

      });

      context('given userCookie is not defined', () => {

        it('should not remove the "user" cookie', async () => {
          const response = await hook(ctx, services);
          if (!isHttpResponse(response)) {
            throw new Error('response should be instance of HttpResponse');
          }

          const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
          strictEqual(value, undefined);
        });

      });

    });

  });

  describe('should verify the CSRF token and', () => {

    context('given the request needs a CSRF check', () => {

      function createContextWithPostMethod(headers: {[name:string]: string}, cookies: {[name:string]: string}): Context {
        return createContext(headers, cookies, {}, 'POST');
      }

      beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, cookie: true, csrf: true })));

      it('should return an HttpResponseForbidden instance if the request has no CSRF token.', async () => {
        ctx = createContextWithPostMethod({}, { [SESSION_DEFAULT_COOKIE_NAME]: csrfSessionID });
        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned a HttpResponseForbidden instance.');
        }

        strictEqual(response.body, 'CSRF token missing or incorrect.');
      });

      it('should throw an error if the session state has no CSRF token.', async () => {
        ctx = createContextWithPostMethod({}, { [SESSION_DEFAULT_COOKIE_NAME]: anonymousSessionID });
        return rejects(
          async () => { await hook(ctx, services) },
          {
            message: 'Unexpected error: the session content does not have a "csrfToken" field. '
              + 'Are you sure you created the session with "createSession"?'
          }
        );
      });

      context('given a CSRF token is sent in the request', () => {
        it('should return an HttpResponseForbidden instance if the CSRF token is incorrect.', async () => {
          ctx = createContextWithPostMethod(
            { 'X-CSRF-Token': incorrectCsrfToken },
            { [SESSION_DEFAULT_COOKIE_NAME]: csrfSessionID },
          );

          const response = await hook(ctx, services);
          if (!isHttpResponseForbidden(response)) {
            throw new Error('The hook should have returned a HttpResponseForbidden instance.');
          }

          strictEqual(response.body, 'CSRF token missing or incorrect.');
        });

        it('should not return an HttpResponseForbidden instance if the CSRF token is correct.', async () => {
          ctx = createContextWithPostMethod(
            { 'X-CSRF-Token': csrfToken },
            { [SESSION_DEFAULT_COOKIE_NAME]: csrfSessionID },
          );

          const response = await hook(ctx, services);
          if (isHttpResponseForbidden(response)) {
            throw new Error('The hook should NOT have returned a HttpResponseForbidden instance.');
          }
        });

      });

    });

  });

  describe('should set Context.session', () => {

    afterEach(() => Config.remove('settings.session.cookie.name'));

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
      Config.set('settings.session.cookie.name', 'auth2');

      ctx = createContext({}, { auth2: anonymousSessionID });
      hook = getHookFunction(UseSessions({ store: Store, cookie: true }));

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

      it('with the null value.', async () => {
        const response = await hook(ctx, services);
        strictEqual(isHttpResponse(response), false);

        strictEqual(ctx.user, null);
      });

      it('and add null as user ID to the log context.', async () => {
        const logger = services.get(Logger);
        const loggerMock = mock.method(logger, 'addLogContext', () => {}).mock;

        await hook(ctx, services);

        strictEqual(loggerMock.callCount(), 1);

        deepStrictEqual(loggerMock.calls[0].arguments, [{ userId: null }]);
      });

    });

    context('given the session has a user ID', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${authenticatedSessionID}`}));

      it('and add null as user ID to the log context.', async () => {
        const logger = services.get(Logger);
        const loggerMock = mock.method(logger, 'addLogContext', () => {}).mock;

        await hook(ctx, services);

        strictEqual(loggerMock.callCount(), 1);

        deepStrictEqual(loggerMock.calls[0].arguments, [{ userId }]);
      });

      context('given options.user is not defined', () => {

        it('with the null value.', async () => {
          const response = await hook(ctx, services);
          strictEqual(isHttpResponse(response), false);

          strictEqual(ctx.user, null);
        });

      });

      context('given options.user is defined', () => {

        const user = { id: userId };
        let actualServices: ServiceManager;

        beforeEach(() => {
          const findUser = async (id: number, services: ServiceManager) => {
            actualServices = services;
            return id === userId ? user : null
          };
          hook = getHookFunction(UseSessions({ store: Store, user: findUser }));
        });

        it('should validate the user ID type.', async () => {
          hook = getHookFunction(UseSessions({
            store: Store,
            user: async () => null,
            userIdType: 'string'
          }));

          await rejects(
            async () => hook(ctx, services),
            new Error('Invalid user ID type: number')
          );
        })

        it('and should call options.user with the service manager.', async () => {
          await hook(ctx, services);

          strictEqual(actualServices, services)
        })

        it('with the user retrieved from the function options.user if it returns a user.', async () => {
          const response = await hook(ctx, services);

          strictEqual(isHttpResponse(response), false);
          strictEqual(ctx.user, user);
        });

        context('given the function options.user returns null (session invalid)', () => {

          const findUser = async (id: number) => null;

          beforeEach(() => hook = getHookFunction(UseSessions({ store: Store, user: findUser })));

          it('with the null value and should destroy the session.', async () => {
            await hook(ctx, services);

            strictEqual(ctx.user, null);
            // tslint:disable-next-line
            strictEqual(ctx.session?.isDestroyed, true);
          });

          context('given options.cookie is false or not defined', () => {

            it(
              'with the null value and should not remove a session cookie in the response '
              + '(it can belongs to another application).',
              async () => {
                const response = await hook(ctx, services);
                if (!isHttpResponse(response)) {
                  throw new Error('The hook should have returned an HttpResponse instance.');
                }

                strictEqual(ctx.user, null);

                deepStrictEqual(response.getCookies(), {});
              }
            );

          });

          context('given options.cookie is true', () => {

            beforeEach(() => {
              hook = getHookFunction(UseSessions({ store: Store, user: findUser, cookie: true }));
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

            it('with the null value and should remove the session cookie.', async () => {
              const response = await hook(ctx, services);
              if (!isHttpResponse(response)) {
                throw new Error('The hook should have returned an HttpResponse instance.');
              }

              strictEqual(ctx.user, null);

              const { value, options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
              strictEqual(value, '');
              deepStrictEqual(options.maxAge, 0);
            });

            context('given userCookie is defined', () => {

              beforeEach(() => {
                hook = getHookFunction(UseSessions({
                  cookie: true,
                  store: Store,
                  user: findUser,
                  userCookie: () => '',
                }));
              });

              it('should remove the "user" cookie.', async () => {
                const response = await hook(ctx, services);
                if (!isHttpResponse(response)) {
                  throw new Error('The hook should have returned an HttpResponse instance.');
                }

                strictEqual(ctx.user, null);

                const { value, options } = response.getCookie(SESSION_USER_COOKIE_NAME);
                strictEqual(value, '');
                deepStrictEqual(options.maxAge, 0);
              });

            });

            context('given userCookie is not defined', () => {

              it('should not remove the "user" cookie.', async () => {
                const response = await hook(ctx, services);
                if (!isHttpResponse(response)) {
                  throw new Error('The hook should have returned an HttpResponse instance.');
                }

                strictEqual(ctx.user, null);

                const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
                strictEqual(value, undefined);
              });

            });

          });

          context('given options.redirectTo is not defined', () => {

            it('with the null value and should return an HttpResponseUnauthorized object.', async () => {
              const response = await hook(ctx, services);

              strictEqual(ctx.user, null);

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

          context('given options.redirectTo is defined', () => {

            beforeEach(() => {
              hook = getHookFunction(UseSessions({ store: Store, user: findUser, redirectTo: '/foo' }));
            });

            it('with the null value and should return an HttpResponseRedirect object.', async () => {
              const response = await hook(ctx, services);

              strictEqual(ctx.user, null);

              if (!isHttpResponseRedirect(response)) {
                throw new Error('response should be instance of HttpResponseRedirect');
              }
              strictEqual(response.path, '/foo');
            });

          });

        });

      });

    });

  });

  describe('should return a post-hook function that', () => {

    context(
      'given an error was thrown in the controller (i.e the response is an HttpResponseInternalServerError)',
      () => {

        beforeEach(() => {
          hook = getHookFunction(UseSessions({ store: Store, cookie: true }));
          ctx = createContext(
            {},
            {
              [SESSION_DEFAULT_COOKIE_NAME]: anonymousSessionID
            },
          );
        });

        it('should not commit the session if it exists.', async () => {
          const postHookFunction = await hook(ctx, services);
          if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
            throw new Error('The hook should return a post hook function');
          }

          await postHookFunction(new HttpResponseInternalServerError());

          // tslint:disable-next-line
          strictEqual(services.get(Store).updateCalledWith?.state.id, undefined);
        });

        it('should not add a session cookie if the cookie option is enabled.', async () => {
          const postHookFunction = await hook(ctx, services);
          if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
            throw new Error('The hook should return a post hook function');
          }

          const response = new HttpResponseInternalServerError();
          await postHookFunction(response);

          const { value } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
          strictEqual(value, undefined);
        });

      }
    );

    context('given the ctx.session has been set by the hook and has not been overridden in the controller', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`}));

      postHookTestHook(async () => {});

    });

    context('given the ctx.session has been set by the hook and has been overridden in the controller', () => {

      beforeEach(() => ctx = createContext({ Authorization: `Bearer ${anonymousSessionID}`}));

      postHookTestHook(async () => readSession(services.get(Store), authenticatedSessionID));

    });

    context('given options.required is false or undefined', () => {

      context('given the ctx.session has not been set by the hook and has been set in the controller', () => {

        beforeEach(() => ctx = createContext());

        postHookTestHook(async () => readSession(services.get(Store), authenticatedSessionID));

      });

    });

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

            return doesNotReject(async () => postHookFunction(new HttpResponseOK()));
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
            hook = getHookFunction(UseSessions({ store: Store, cookie: true }));
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

          context('given userCookie is defined', () => {

            beforeEach(() => {
              hook = getHookFunction(UseSessions({ store: Store, cookie: true, userCookie: () => '' }));
            });

            it('should remove the "user" cookie', async () => {
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

              const { value, options } = response.getCookie(SESSION_USER_COOKIE_NAME);
              strictEqual(value, '');
              deepStrictEqual(options.maxAge, 0);
            });

          });

          context('given userCookie is not defined', () => {

            it('should not remove the "user" cookie', async () => {
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

              const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
              strictEqual(value, undefined);
            });

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
            hook = getHookFunction(UseSessions({ store: Store, cookie: true }));
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

          it('should set a cookie in the response with the session ID as value.', async () => {
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

          context('given userCookie is defined', () => {

            let userCookieParameters: { ctx?: Context, services?: ServiceManager } = {};

            beforeEach(() => {
              hook = getHookFunction(UseSessions({
                cookie: true,
                store: Store,
                userCookie: (ctx, services) => {
                  userCookieParameters = { ctx, services };
                  return 'foo';
                },
              }));
            });

            it('should call userCookie and set a "user" cookie in the response.', async () => {
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

              strictEqual(userCookieParameters.ctx, ctx);
              strictEqual(userCookieParameters.services, services);

              const { value, options } = response.getCookie(SESSION_USER_COOKIE_NAME);
              strictEqual(value, 'foo');
              deepStrictEqual(options.expires, new Date(ctx.session.expirationTime * 1000));
            });

          });

          context('given userCookie is not defined', () => {

            it('should not set a "user" cookie in the response.', async () => {
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

              const { value } = response.getCookie(SESSION_USER_COOKIE_NAME);
              strictEqual(value, undefined);
            });

          });

        });

      });

    }

  });

  describe('should define an API specification', () => {

    afterEach(() => Config.remove('settings.session.csrf.enabled'));

    it('unless options.openapi is false.', () => {
      @UseSessions({ openapi: false })
      class Foobar {}

      strictEqual(getApiSecurity(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
      deepStrictEqual(getApiComponents(Foobar, new Foobar()), {});
    });

    it('with the proper security scheme (cookie).', () => {
      @UseSessions({ cookie: true })
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
      Config.set('settings.session.cookie.name', 'auth2');

      @UseSessions({ cookie: true })
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
      @UseSessions()
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

    context('given options.required is true', () => {

      it('with the proper security requirement (cookie).', () => {
        @UseSessions({ cookie: true, required: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { cookieAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      it('with the proper security requirement (no cookie).', () => {
        @UseSessions({ required: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { bearerAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      function testResponses(options: { cookie: boolean }) {
        @UseSessions({ ...options, required: true })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is missing or invalid.' }
        });
      }

      it('with the proper API responses (no cookie & no csrf protection).', () => {
        testResponses({ cookie: false });
      });

      it('with the proper API responses (no cookie & csrf protection).', () => {
        Config.set('settings.session.csrf.enabled', true);

        testResponses({ cookie: false });
      });

      it('with the proper API responses (cookie & no csrf protection).', () => {
        testResponses({ cookie: true });
      });

      it('with the proper API responses (cookie & csrf protection).', () => {
        Config.set('settings.session.csrf.enabled', true);

        @UseSessions({ cookie: true, required: true })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is missing or invalid.' },
          403: { description: 'CSRF token is missing or incorrect.'}
        });
      });

    });

    context('given options.required is false or undefined', () => {

      it('with no security requirement (cookie).', () => {
        @UseSessions({ cookie: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      it('with no security requirement (no cookie).', () => {
        @UseSessions()
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      function testResponses(options: { cookie: boolean }) {
        @UseSessions(options)
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is invalid.' }
        });
      }

      it('with the proper API responses (no cookie & no csrf protection).', () => {
        testResponses({ cookie: false });
      });

      it('with the proper API responses (no cookie & csrf protection).', () => {
        Config.set('settings.session.csrf.enabled', true);

        testResponses({ cookie: false });
      });

      it('with the proper API responses (cookie & no csrf protection).', () => {
        testResponses({ cookie: true });
      });

      it('with the proper API responses (cookie & csrf protection).', () => {
        Config.set('settings.session.csrf.enabled', true);

        @UseSessions({ cookie: true })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'Auth token is invalid.' },
          403: { description: 'CSRF token is missing or incorrect.'}
        });
      });

    });

  });

});

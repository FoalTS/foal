// std
import { strictEqual } from 'assert';

// 3p
import {
  ConfigNotFoundError,
  Context,
  getHookFunction,
  isHttpResponse,
  isHttpResponseForbidden,
  ServiceManager,
  Session
} from '@foal/core';

// FoalTS
import { CsrfTokenRequired } from './csrf-token-required.hook';

describe('CsrfTokenRequired', () => {

  afterEach(() => delete process.env.SETTINGS_CSRF_ENABLED);

  it('should not thow any error nor return an HttResponse object if settings.csrf.enabled is false.', async () => {
    const hook = getHookFunction(CsrfTokenRequired());
    const ctx = new Context({});
    const services = new ServiceManager();
    process.env.SETTINGS_CSRF_ENABLED = 'false';
    strictEqual(isHttpResponse(await hook(ctx, services)), false);
  });

  describe('given options.doubleSubmitCookie is false or undefined', () => {

    const hook = getHookFunction(CsrfTokenRequired());
    const services = new ServiceManager();

    it('should throw an error if Context.session is undefined.', async () => {
      const ctx = new Context({});
      try {
        await hook(ctx, services);
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          '@CsrfTokenRequired requires the use of sessions. Use @TokenRequired or set "doubleSubmitCookie" to true.'
        );
      }
    });

    it('should throw if the session content has no CSRF token.', async () => {
      const ctx = new Context({});
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      try {
        await hook(ctx, services);
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          'No CSRF token found in the session.'
        );
      }
    });

    describe('should verify the csrf token and', () => {

      it('should return an HttpResponseForbidden object if the token is incorrect.', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'bbb' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should not return an HttpResponseForbidden object if the token is correct (body._csrf).', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct (query._csrf).', async () => {
        const ctx = new Context<any, Session>({ query: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'csrf-token': 'xxx' } });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'xsrf-token': 'xxx' } });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-csrf-token': 'xxx' } });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-xsrf-token': 'xxx' } });
        ctx.session = new Session(
          {} as any,
          {
            content: { csrfToken: 'xxx' },
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

    });

    it('should not return an HttpResponseForbidden object if the method is GET.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'GET' });
      ctx.session = new Session(
        {} as any,
        {
          content: { csrfToken: 'xxx' },
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is HEAD.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'HEAD' });
      ctx.session = new Session(
        {} as any,
        {
          content: { csrfToken: 'xxx' },
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is OPTIONS.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'OPTIONS' });
      ctx.session = new Session(
        {} as any,
        {
          content: { csrfToken: 'xxx' },
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

  });

  describe('given options.doubleSubmitCookie is true', () => {

    const hook = getHookFunction(CsrfTokenRequired({ doubleSubmitCookie: true }));
    const services = new ServiceManager();

    const secret = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
    const token = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk';

    beforeEach(() => process.env.SETTINGS_CSRF_SECRET = secret);

    afterEach(() => {
      delete process.env.SETTINGS_CSRF_SECRET;
      delete process.env.SETTINGS_CSRF_COOKIE_NAME;
    });

    it('should throw an error if the configuration key settings.csrf.secret is empty.', async () => {
      delete process.env.SETTINGS_CSRF_SECRET;
      const ctx = new Context({});
      try {
        await hook(ctx, services);
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown');
        }
        strictEqual(error.key, 'settings.csrf.secret');
        strictEqual(error.msg, 'You must provide a secret when using @CsrfTokenRequired.');
      }
    });

    it('should return an HttpResponseForbidden object if the "csrfToken" cookie is not found.', async () => {
      const ctx = new Context<any, Session>({ cookies: {} });
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );

      const response = await hook(ctx, services);
      if (!isHttpResponseForbidden(response)) {
        throw new Error('The hook should have returned an HttpResponseForbidden object.');
      }
      strictEqual(response.body, 'Cookie "csrfToken" not found.');
    });

    it('should return an HttpResponseForbidden object if the csrf cookie is not found (custom name).', async () => {
      process.env.SETTINGS_CSRF_COOKIE_NAME = 'csrf';

      const ctx = new Context<any, Session>({ cookies: { csrfToken: 'xxx' } });
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      const response = await hook(ctx, services);
      if (!isHttpResponseForbidden(response)) {
        throw new Error('The hook should have returned an HttpResponseForbidden object.');
      }
      strictEqual(response.body, 'Cookie "csrf" not found.');
    });

    describe('should verify the csrf token and', () => {

      it('should return an HttpResponseForbidden object if the the signature of the cookie "csrfToken"'
          + ' is incorrect.', async () => {
        const token = 'xxx';
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should return an HttpResponseForbidden object if the token is incorrect.', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should not return an HttpResponseForbidden object if the token is correct (body._csrf).', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct (query._csrf).', async () => {
        const ctx = new Context<any, Session>({ query: { _csrf: token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'csrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'xsrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-csrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-xsrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session(
          {} as any,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'a',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

    });

    it('should not return an HttpResponseForbidden object if the method is GET.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'GET', cookies: { csrfToken: token } });
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is HEAD.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'HEAD', cookies: { csrfToken: token } });
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is OPTIONS.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'OPTIONS', cookies: { csrfToken: token } });
      ctx.session = new Session(
        {} as any,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(await hook(ctx, services), undefined);
    });

  });

});

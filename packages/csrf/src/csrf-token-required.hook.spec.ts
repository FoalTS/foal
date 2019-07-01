// std
import { strictEqual } from 'assert';

// 3p
import {
  Config, ConfigMock, Context, getHookFunction,
  HttpResponseOK, isHttpResponse, isHttpResponseForbidden, ServiceManager, Session, verifySignedToken
} from '@foal/core';

// FoalTS
import { CsrfTokenRequired } from './csrf-token-required.hook';

describe('CsrfTokenRequired', () => {

  it('should not thow any error nor return an HttResponse object if settings.csrf.enabled is false.', async () => {
    const hook = getHookFunction(CsrfTokenRequired());
    const ctx = new Context({});
    const services = new ServiceManager();
    const config = new ConfigMock();
    services.set(Config, config);

    config.set('settings.csrf.enabled', false);
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

    it('should add the session key "csrfToken" if it does not exist.', async () => {
      const ctx = new Context<any, Session>({ headers: {} });
      ctx.session = new Session('a', {}, 0);

      strictEqual(ctx.session.get('csrfToken'), undefined);
      await hook(ctx, services);
      strictEqual(typeof ctx.session.get('csrfToken'), 'string');
    });

    it('should not modify the session key "csrfToken" if it already exists.', async () => {
      const ctx = new Context<any, Session>({ headers: {} });
      ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);

      await hook(ctx, services);
      strictEqual(ctx.session.get('csrfToken'), 'xxx');
    });

    describe('should verify the csrf token and', () => {

      it('should return an HttpResponseForbidden object if the token is incorrect.', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session('a', { csrfToken: 'bbb' }, 0);

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should not return an HttpResponseForbidden object if the token is correct (body._csrf).', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct (query._csrf).', async () => {
        const ctx = new Context<any, Session>({ query: { _csrf: 'xxx' }, headers: {} });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'csrf-token': 'xxx' } });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'xsrf-token': 'xxx' } });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-csrf-token': 'xxx' } });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-xsrf-token': 'xxx' } });
        ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

    });

    it('should not return an HttpResponseForbidden object if the method is GET.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'GET' });
      ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is HEAD.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'HEAD' });
      ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is OPTIONS.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'OPTIONS' });
      ctx.session = new Session('a', { csrfToken: 'xxx' }, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

  });

  describe('given options.doubleSubmitCookie is true', () => {

    const hook = getHookFunction(CsrfTokenRequired({ doubleSubmitCookie: true }));
    const services = new ServiceManager();
    const config = new ConfigMock();
    services.set(Config, config);

    const secret = '-_BmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmY';
    const token = '-_BmZmZmZmZmZmZmZmZmZg.rD1LLZl5sr-IhjUJZONyXHS9VepB5dyhJiUIPaa2wfk';

    beforeEach(() => {
      config.reset();
      config.set('settings.csrf.secret', secret);
    });

    it('should throw an error if the configuration key settings.csrf.secret is empty.', async () => {
      config.reset();
      const ctx = new Context({});
      try {
        await hook(ctx, services);
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(
          error.message,
          '[CONFIG] You must provide a secret with the configuration key settings.csrf.secret.'
        );
      }
    });

    it('should return an HttpResponseForbidden object if the "csrfToken" cookie is not found.', async () => {
      const ctx = new Context<any, Session>({ cookies: {} });
      ctx.session = new Session('a', {}, 0);

      const response = await hook(ctx, services);
      if (!isHttpResponseForbidden(response)) {
        throw new Error('The hook should have returned an HttpResponseForbidden object.');
      }
      strictEqual(response.body, 'Cookie "csrfToken" not found.');
    });

    describe('should verify the csrf token and', () => {

      it('should return an HttpResponseForbidden object if the the signature of the cookie "csrfToken"'
          + ' is incorrect.', async () => {
        const token = 'xxx';
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should return an HttpResponseForbidden object if the token is incorrect.', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: 'xxx' }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned an HttpResponseForbidden object.');
        }
        strictEqual(response.body, 'Bad csrf token.');
      });

      it('should not return an HttpResponseForbidden object if the token is correct (body._csrf).', async () => {
        const ctx = new Context<any, Session>({ body: { _csrf: token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct (query._csrf).', async () => {
        const ctx = new Context<any, Session>({ query: { _csrf: token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'csrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'xsrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-csrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-csrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

      it('should not return an HttpResponseForbidden object if the token is correct '
          + '(headers["x-xsrf-token"]).', async () => {
        const ctx = new Context<any, Session>({ headers: { 'x-xsrf-token': token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);
        strictEqual(isHttpResponse(await hook(ctx, services)), false);
      });

    });

    it('should not return an HttpResponseForbidden object if the method is GET.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'GET', cookies: { csrfToken: token } });
      ctx.session = new Session('a', {}, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is HEAD.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'HEAD', cookies: { csrfToken: token } });
      ctx.session = new Session('a', {}, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

    it('should not return an HttpResponseForbidden object if the method is OPTIONS.', async () => {
      const ctx = new Context<any, Session>({ headers: {}, method: 'OPTIONS', cookies: { csrfToken: token } });
      ctx.session = new Session('a', {}, 0);
      strictEqual(await hook(ctx, services), undefined);
    });

    describe('should return a hook post function that sets a "csrfToken" cookie that', () => {

      it('should contain a signed token.', async () => {
        const ctx = new Context<any, Session>({ query: { _csrf: token }, cookies: { csrfToken: token } });
        ctx.session = new Session('a', {}, 0);

        const postHookFunction = await hook(ctx, services);
        if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
          throw new Error('The hook should return an hook post function');
        }

        const response = new HttpResponseOK();
        await postHookFunction(response);

        const { value } = response.getCookie('csrfToken');
        if (!value) {
          throw new Error('The cookie "csrfToken" does not exist.');
        }
        if (!verifySignedToken(value, secret)) {
          throw new Error('Invalid signature for the token.');
        }
      });

      // should have the proper directives.

    });

  });

});

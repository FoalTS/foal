// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponseRedirect,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager,
} from '../core';
import { LoginOptional } from './login-optional.hook';
import { LoginRequired } from './login-required.hook';

export function testSuite(Login: typeof LoginOptional|typeof LoginRequired, required: boolean) {

  let hook: HookFunction;

  async function fetchUser(id: number|string) {
    return id === 1 ? { email: 'john@foalts.org', id: 1 } : undefined;
  }

  beforeEach(() =>  hook = getHookFunction(Login({ user: fetchUser })));

  it('should throw an Error if there is no session.', () => {
    const ctx = new Context({});

    return (hook(ctx, new ServiceManager()) as Promise<any>)
      .then(() => fail('The promise should be rejected'))
      .catch(err => strictEqual(err.message, 'LoginRequired and LoginOptional hooks require session management.'));
  });

  if (required) {

    it('should return an HttpResponseUnauthorized object if the session does not have an '
        + '`authentication.userId` property.', async () => {
      let ctx = new Context({ session: {} });
      let response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');

      ctx = new Context({ session: { authentication: {} } });
      response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');
    });

    it('should return an HttpResponseRedirect object if the session does not have an '
        + '`authentication.userId` property and if options.redirect is defined.', async () => {
      hook = getHookFunction(Login({ redirect: '/foo', user: fetchUser }));

      let ctx = new Context({ session: {} });
      let response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
      strictEqual((response as HttpResponseRedirect).path, '/foo');

      ctx = new Context({ session: { authentication: {} } });
      response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
      strictEqual((response as HttpResponseRedirect).path, '/foo');
    });

    it('should return an HttpResponseUnauthorized object if no user matches the given userId.', async () => {
      const ctx = new Context({
        session: {
          authentication: {
            userId: 2
          }
        }
      });
      const response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');
    });

    it('should return an HttpResponseRedirect object if no user matches the given userId'
        + ' and if options.redirect is defined.', async () => {
      hook = getHookFunction(Login({ redirect: '/foo', user: fetchUser }));

      const ctx = new Context({
        session: {
          authentication: {
            userId: 2
          }
        }
      });
      const response = await hook(ctx, new ServiceManager());

      ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
      strictEqual((response as HttpResponseRedirect).path, '/foo');
    });

  } else {

    it('should return undefined and assign undefined to ctx.user if the session does not have an '
        + '`authentication.userId` property.', async () => {
      const ctx = new Context({ session: {} });
      const response = await hook(ctx, new ServiceManager());

      strictEqual(response, undefined);
      strictEqual(ctx.user, undefined);
    });

    it('should return undefined and assign undefined to ctx.user if no user matches the given userId.', async () => {
      const ctx = new Context({
        session: {
          authentication: {
            userId: 2
          }
        }
      });
      const response = await hook(ctx, new ServiceManager());

      strictEqual(response, undefined);
      strictEqual(ctx.user, undefined);
    });

  }

  it('should return undefined and set ctx.user if a user matches the given id.', async () => {
    const ctx = new Context({
      session: {
        authentication: {
          userId: 1
        }
      }
    });
    const response = await hook(ctx, new ServiceManager());

    strictEqual(response, undefined);
    notStrictEqual(ctx.user, undefined);
    // TODO: remove "as { id: 1 }"
    strictEqual((ctx.user as { id: number }).id, 1);
  });

}

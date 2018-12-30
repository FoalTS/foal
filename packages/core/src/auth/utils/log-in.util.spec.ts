// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { Context } from '../../core';
import { logIn } from './log-in.util';

describe('logIn', () => {

  it('should create or update ctx.session.authentication to include the userId.', () => {
    const ctx = new Context({ session: {} });
    const user = { id: 1 };

    logIn(ctx, user);

    deepStrictEqual(ctx.request.session.authentication, {
      userId: 1
    });

    ctx.request.session.authentication.foo = 'bar';

    logIn(ctx, user);

    deepStrictEqual(ctx.request.session.authentication, {
      foo: 'bar',
      userId: 1
    });
  });

  it('should support a custom idKey.', async () => {
    const ctx = new Context({ session: {} });
    const user = { _id: 1 };

    logIn(ctx, user, '_id');

    deepStrictEqual(ctx.request.session.authentication, {
      userId: 1
    });

  });

});

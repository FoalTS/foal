// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { Context } from '../../core';
import { UserWithPermissions } from '../entities';
import { logIn } from './log-in.util';

describe('logIn', () => {

  it('should create or update ctx.session.authentication to include the userId.', async () => {
    const ctx = new Context({ session: {} });
    const user = { id: 1 } as UserWithPermissions;

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

});

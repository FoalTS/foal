// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { Context } from '../../core';
import { logOut } from './log-out.util';

describe('logOut', () => {

  it('should delete ctx.session.authentication if it exists.', async () => {
    const ctx = new Context({});
    ctx.request.session = {
      authentication: {
        userId: 1
      }
    };

    logOut(ctx);

    deepStrictEqual(ctx.request.session, {});
  });

  it('should not throw an error if ctx.session.authentication is undefined.', async () => {
    const ctx = new Context({});
    ctx.request.session = {};

    logOut(ctx);
  });

});

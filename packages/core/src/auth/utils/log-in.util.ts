import { Context } from '../../core';

export function logIn(ctx: Context, user: object, idKey = 'id') {
  ctx.request.session.authentication = {
    ...ctx.request.session.authentication,
    userId: user[idKey]
  };
}

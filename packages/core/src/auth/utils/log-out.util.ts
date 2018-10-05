import { Context } from '../../core';

export function logOut(ctx: Context) {
  delete ctx.request.session.authentication;
}

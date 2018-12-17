import { Context } from '../../core';
import { UserWithPermissions } from '../entities';

export function logIn(ctx: Context, user: UserWithPermissions) {
  ctx.request.session.authentication = {
    ...ctx.request.session.authentication,
    userId: user.id
  };
}

import { Context } from '../../core';
import { AbstractUser } from '../entities';

export function logIn(ctx: Context, user: AbstractUser) {
  ctx.request.session.authentication = {
    ...ctx.request.session.authentication,
    userId: user.id
  };
}

import { getManager } from 'typeorm';

import { Class, PreHook } from '../../core';
import { AbstractUser } from '../models';

export function authenticate(UserEntity: Class<AbstractUser>): PreHook {
  return async ctx => {
    if (!ctx.session) {
      throw new Error('authenticate pre-hook requires session management.');
    }
    if (!ctx.session.authentication || !ctx.session.authentication.hasOwnProperty('userId')) {
      return;
    }
    ctx.user = await getManager().findOne(UserEntity, ctx.session.authentication.userId);
  };
}

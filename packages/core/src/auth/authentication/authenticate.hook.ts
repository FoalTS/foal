import { getManager } from 'typeorm';

import { Class, Hook, HookDecorator } from '../../core';
import { AbstractUser } from '../entities';

export function Authenticate(UserEntity: Class<AbstractUser>): HookDecorator {
  return Hook(async ctx => {
    if (!ctx.request.session) {
      throw new Error('Authenticate hook requires session management.');
    }
    if (!ctx.request.session.authentication || !ctx.request.session.authentication.hasOwnProperty('userId')) {
      return;
    }
    ctx.user = await getManager().findOne(
      UserEntity,
      ctx.request.session.authentication.userId,
      { relations: [ 'userPermissions', 'groups', 'groups.permissions' ] }
    );
  });
}

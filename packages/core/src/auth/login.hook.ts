// 3p
import { getManager } from 'typeorm';

// FoalTS
import {
  Class,
  Hook,
  HookDecorator,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../core';
import { AbstractUser } from './entities';

export function Login(required: boolean,
                      options: { redirect?: string, userEntity: Class<AbstractUser> }): HookDecorator {
  return Hook(async ctx => {
    if (!ctx.request.session) {
      throw new Error('LoginRequired hook requires session management.');
    }
    if (!ctx.request.session.authentication || !ctx.request.session.authentication.hasOwnProperty('userId')) {
      return options.redirect ? new HttpResponseRedirect(options.redirect) : new HttpResponseUnauthorized();
    }
    const user = await getManager().findOne(
      options.userEntity,
      ctx.request.session.authentication.userId,
      { relations: [ 'userPermissions', 'groups', 'groups.permissions' ] }
    );
    if (!user) {
      return options.redirect ? new HttpResponseRedirect(options.redirect) : new HttpResponseUnauthorized();
    }
    ctx.user = user;
  });
}

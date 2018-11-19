// std
import { promisify } from 'util';

// 3p
import { AbstractUser, Class, Config, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

export function AuthenticateWithJwtHeader(entityClass: Class<AbstractUser>): HookDecorator {
  return Hook(async (ctx, services) => {
    const authorizationHeader = ctx.request.get('Authorization') as string|undefined;
    if (!authorizationHeader) {
      return;
    }

    const token = authorizationHeader.split('Bearer ')[1] as string|undefined;
    if (!token) {
      return new HttpResponseBadRequest({
        message: 'Format is Authorization: Bearer <token>'
      });
    }

    const payload = await promisify(verify)(token, Config.get('jwt', 'secret'));
    // What about rejected errors?
    // Access token is invalid
    if (!payload || typeof payload.sub !== 'string') {
      return;
    }

    const id = parseInt(payload.sub, 10);
    if (isNaN(id)) {
      return;
    }

    const user = await getRepository(entityClass).findOne({ id });
    if (!user) {
      return;
    }

    ctx.user = user;
  });
}

// std
import { promisify } from 'util';

// 3p
import {
  AbstractUser, Class, Config, Hook, HookDecorator,
  HttpResponseBadRequest, HttpResponseUnauthorized
} from '@foal/core';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

export function AuthenticateWithJwtHeader(entityClass: Class<AbstractUser>): HookDecorator {
  return Hook(async (ctx, services) => {
    const secret = Config.get('jwt', 'secret') as string|undefined;
    if (!secret) {
      throw new Error('You must provide a secret in jwt.json or in the JWT_SECRET environment variable.');
    }
    const authorizationHeader = ctx.request.get('Authorization') as string|undefined || '';
    if (!authorizationHeader) {
      return new HttpResponseBadRequest({
        code: 'invalid_request',
        description: 'Authorization header not found.'
      });
    }
    const token = authorizationHeader.split('Bearer ')[1] as string|undefined;
    if (!token) {
      return new HttpResponseBadRequest({
        code: 'invalid_request',
        description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.'
      });
    }

    let payload;
    try {
      payload = await promisify(verify)(token, Config.get('jwt', 'secret'));
    } catch (error) {
      return new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: error.message
      });
    }
    // if (!payload || typeof payload.sub !== 'string') {
    //   return;
    // }

    // const id = parseInt(payload.sub, 10);
    // if (isNaN(id)) {
    //   return;
    // }

    // const user = await getRepository(entityClass).findOne({ id });
    // if (!user) {
    //   return;
    // }

    // ctx.user = user;
  });
}

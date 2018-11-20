// 3p
import {
  AbstractUser, Class, Config, Hook, HookDecorator,
  HttpResponseBadRequest, HttpResponseUnauthorized
} from '@foal/core';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

export function JWTRequired(entityClass?: Class<AbstractUser>, options: VerifyOptions = {}): HookDecorator {
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
      payload = await new Promise((resolve, reject) => {
        verify(token, secret, options, (err, value) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });
    } catch (error) {
      return new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: error.message
      });
    }

    if (!entityClass) {
      ctx.user = payload;
      return;
    }

    if (typeof payload.sub !== 'string') {
      return new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: 'The token must include a subject which is the id of the user.'
      });
    }

    const user = await getRepository(entityClass).findOne({ id: payload.sub });
    if (!user) {
      return new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: 'The token subject does not match any user.'
      });
    }

    ctx.user = user;
  });
}

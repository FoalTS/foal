// 3p
import {
  Config, Hook, HookDecorator,
  HttpResponseBadRequest, HttpResponseUnauthorized
} from '@foal/core';
import { verify, VerifyOptions } from 'jsonwebtoken';

export interface JWTOptions {
  user?: (id: string|number) => Promise<any|undefined>;
  blackList?: (token: string) => boolean|Promise<boolean>;
  cookie?: boolean;
}

export function JWT(required: boolean, options: JWTOptions, verifyOptions: VerifyOptions): HookDecorator {
  return Hook(async (ctx, services) => {
    const secretOrPublicKey = Config.get('jwt', 'secretOrPublicKey') as string|undefined;
    if (!secretOrPublicKey) {
      throw new Error(
        'You must provide a secretOrPublicKey in jwt.json or in the JWT_SECRET_OR_PUBLIC_KEY environment variable.'
        );
    }

    let token: string;
    if (options.cookie) {
      const cookieName = Config.get('jwt', 'cookieName') as string|undefined || 'auth';
      const content = ctx.request.cookies[cookieName] as string|undefined;

      if (!content) {
        if (!required) {
          return;
        }
        return new HttpResponseBadRequest({
          code: 'invalid_request',
          description: 'Auth cookie not found.'
        });
      }

      token = content;
    } else {
      const authorizationHeader = ctx.request.get('Authorization') as string|undefined || '';

      if (!authorizationHeader) {
        if (!required) {
          return;
        }
        return new HttpResponseBadRequest({
          code: 'invalid_request',
          description: 'Authorization header not found.'
        });
      }

      const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
      if (!content) {
        return new HttpResponseBadRequest({
          code: 'invalid_request',
          description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.'
        });
      }

      token = content;
    }

    if (options.blackList && await options.blackList(token)) {
      const response = new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: 'jwt revoked'
      });
      response.setHeader('WWW-Authenticate', 'error="invalid_token", error_description="jwt revoked"');
      return response;
    }

    let payload;
    try {
      payload = await new Promise((resolve, reject) => {
        verify(token, secretOrPublicKey, verifyOptions, (err, value) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });
    } catch (error) {
      const response = new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: error.message
      });
      response.setHeader('WWW-Authenticate', `error="invalid_token", error_description="${error.message}"`);
      return response;
    }

    if (!options.user) {
      ctx.user = payload;
      return;
    }

    if (typeof payload.sub !== 'string') {
      const response = new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: 'The token must include a subject which is the id of the user.'
      });
      response.setHeader(
        'WWW-Authenticate',
        'error="invalid_token", error_description="The token must include a subject which is the id of the user."'
      );
      return response;
    }

    const user = await options.user(payload.sub);
    if (!user) {
      const response = new HttpResponseUnauthorized({
        code: 'invalid_token',
        description: 'The token subject does not match any user.'
      });
      response.setHeader(
        'WWW-Authenticate',
        'error="invalid_token", error_description="The token subject does not match any user."'
      );
      return response;
    }

    ctx.user = user;
  });
}

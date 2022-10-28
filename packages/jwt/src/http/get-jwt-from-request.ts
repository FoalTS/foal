import { Config, Context } from '@foal/core';

import { JWT_DEFAULT_COOKIE_NAME } from './constants';

export class RequestValidationError extends Error {}

export function getJwtFromRequest(request: Context['request'], location: 'token-in-header'|'token-in-cookie', required: boolean): string|undefined {
  let token: string|undefined;

  switch (location) {
    case 'token-in-header':
        const headerContent = request.get('Authorization');
        if (!headerContent) {
          if (required) {
            throw new RequestValidationError('Authorization header not found.');
          }
          return;
        }
        token = headerContent?.split('Bearer ')[1] as string|undefined;
        if (!token) {
          throw new RequestValidationError('Expected a bearer token. Scheme is Authorization: Bearer <token>.');
        }
        return token;
    case 'token-in-cookie':
      const cookieName = Config.get('settings.jwt.cookie.name', 'string', JWT_DEFAULT_COOKIE_NAME);
      token = request.cookies[cookieName];
      if (!token && required) {
        throw new RequestValidationError('Auth cookie not found.');
      }
      return token;
    default:
      throw new Error('Invalid location.');
  }
}
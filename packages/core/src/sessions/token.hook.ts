import {
  ApiDefineSecurityScheme,
  ApiResponse,
  ApiSecurityRequirement,
  Class,
  ClassOrAbstractClass,
  Config,
  Context,
  Hook,
  HookDecorator,
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  IApiSecurityScheme,
  ServiceManager
} from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { readSession } from './read-session';
import { removeSessionCookie } from './remove-session-cookie';
import { SessionStore } from './session-store';
import { setSessionCookie } from './set-session-cookie';

export interface TokenOptions {
  user?: (id: string|number) => Promise<any|undefined>;
  store?: Class<SessionStore>;
  cookie?: boolean;
  redirectTo?: string;
  openapi?: boolean;
}

export function Token(required: boolean, options: TokenOptions): HookDecorator {

  function badRequestOrRedirect(description: string): HttpResponse {
    if (options.redirectTo) {
      return new HttpResponseRedirect(options.redirectTo);
    }
    return new HttpResponseBadRequest({ code: 'invalid_request', description });
  }

  function unauthorizedOrRedirect(description: string): HttpResponse {
    if (options.redirectTo) {
      return new HttpResponseRedirect(options.redirectTo);
    }
    return new HttpResponseUnauthorized({ code: 'invalid_token', description })
      .setHeader(
        'WWW-Authenticate',
        `error="invalid_token", error_description="${description}"`
      );
  }

  async function hook(ctx: Context, services: ServiceManager) {
    const ConcreteSessionStore: ClassOrAbstractClass<SessionStore> = options.store || SessionStore;
    const store = services.get(ConcreteSessionStore);

    /* Validate the request */

    let sessionID: string;

    if (options.cookie) {
      const cookieName = Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);
      const content = ctx.request.cookies[cookieName] as string|undefined;

      if (!content) {
        if (!required) {
          return;
        }
        return badRequestOrRedirect('Session cookie not found.');
      }

      sessionID = content;
    } else {
      const authorizationHeader = ctx.request.get('Authorization') || '';

      if (!authorizationHeader) {
        if (!required) {
          return;
        }
        return badRequestOrRedirect('Authorization header not found.');
      }

      const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
      if (!content) {
        return badRequestOrRedirect('Expected a bearer token. Scheme is Authorization: Bearer <token>.');
      }

      sessionID = content;
    }

    /* Verify the session ID */

    const session = await readSession(store, sessionID);

    if (!session) {
      const response = unauthorizedOrRedirect('token invalid or expired');
      if (options.cookie) {
        removeSessionCookie(response);
      }
      return response;
    }

    /* Set ctx.session */

    ctx.session = session;

    /* Set ctx.user */

    // TODO: given userRequired, if userId === null OR options.user returns null, return response.
    // TODO: if the ID returns no user, destroy the session and remove the cookie.

    if (session.userId !== null && options.user) {
      ctx.user = await options.user(session.userId);
      if (!ctx.user) {
        return unauthorizedOrRedirect('The token does not match any user.');
      }
    }

    return async (response: HttpResponse) => {
      // TODO: session = ctx.session;
      if (session.isDestroyed) {
        if (options.cookie) {
          removeSessionCookie(response);
        }
        return;
      }

      await session.commit();

      if (options.cookie) {
        setSessionCookie(response, session);
      }
    };
  }

  const openapi = [
    required ?
      ApiResponse(401, { description: 'Auth token is missing or invalid.' }) :
      ApiResponse(401, { description: 'Auth token is invalid.' })
  ];

  if (options.cookie) {
    const securityScheme: IApiSecurityScheme = {
      in: 'cookie',
      name: Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME),
      type: 'apiKey',
    };
    openapi.push(ApiDefineSecurityScheme('cookieAuth', securityScheme));
    if (required) {
      openapi.push(ApiSecurityRequirement({ cookieAuth: [] }));
    }
  } else {
    const securityScheme: IApiSecurityScheme = {
      scheme: 'bearer',
      type: 'http',
    };
    openapi.push(ApiDefineSecurityScheme('bearerAuth', securityScheme));
    if (required) {
      openapi.push(ApiSecurityRequirement({ bearerAuth: [] }));
    }
  }

  return Hook(hook, openapi, { openapi: options.openapi });
}

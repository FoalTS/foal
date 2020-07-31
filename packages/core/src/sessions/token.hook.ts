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
import { removeSessionCookie } from './remove-session-cookie';
import { Session } from './session';
import { SessionStore } from './session-store';
import { setSessionCookie } from './set-session-cookie';

// TODO: Add missing documentation.

class InvalidRequestResponse extends HttpResponseBadRequest {

  constructor(description: string) {
    super({ code: 'invalid_request', description });
  }

}

class InvalidTokenResponse extends HttpResponseUnauthorized {

  constructor(description: string) {
    super({ code: 'invalid_token', description });
    this.setHeader(
      'WWW-Authenticate',
      `error="invalid_token", error_description="${description}"`
    );
  }

}

export interface TokenOptions {
  user?: (id: string|number) => Promise<any|undefined>;
  store?: Class<SessionStore>;
  cookie?: boolean;
  redirectTo?: string;
  openapi?: boolean;
}

export function Token(required: boolean, options: TokenOptions): HookDecorator {
  async function hook(ctx: Context, services: ServiceManager) {
    const ConcreteSessionStore: ClassOrAbstractClass<SessionStore> = options.store || SessionStore;
    const store = services.get(ConcreteSessionStore);

    const cookieName = Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);

    /* Validate the request */

    let sessionID: string;
    if (options.cookie) {
      const content = ctx.request.cookies[cookieName] as string|undefined;

      if (!content) {
        if (!required) {
          return;
        }
        if (options.redirectTo) {
          return new HttpResponseRedirect(options.redirectTo);
        }
        return new InvalidRequestResponse('Session cookie not found.');
      }

      sessionID = content;
    } else {
      const authorizationHeader = ctx.request.get('Authorization') || '';

      if (!authorizationHeader) {
        if (!required) {
          return;
        }
        if (options.redirectTo) {
          return new HttpResponseRedirect(options.redirectTo);
        }
        return new InvalidRequestResponse('Authorization header not found.');
      }

      const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
      if (!content) {
        if (options.redirectTo) {
          return new HttpResponseRedirect(options.redirectTo);
        }
        return new InvalidRequestResponse('Expected a bearer token. Scheme is Authorization: Bearer <token>.');
      }

      sessionID = content;
    }

    /* Verify the session ID */

    const sessionState = await store.read(sessionID);

    if (!sessionState) {
      let response: HttpResponse = new InvalidTokenResponse('token invalid or expired');
      if (options.redirectTo) {
        response = new HttpResponseRedirect(options.redirectTo);
      }
      if (options.cookie) {
        removeSessionCookie(response);
      }
      return response;
    }

    // TODO: test the store argument.
    // TODO: replace with Session.read(this.store)
    const session = new Session(store, sessionState);

    ctx.session = session;

    /* Verify the session content */

    const userId = session.getState().userId;

    if (!options.user) {
      ctx.user = userId;
    } else {
      if (typeof userId !== 'number' && typeof userId !== 'string') {
        throw new Error(
          `The "userId" value of the session ${sessionID} must be a string or a number. Got "${typeof userId}".`
        );
      }
      const user = await options.user(userId);
      if (!user) {
        if (options.redirectTo) {
          return new HttpResponseRedirect(options.redirectTo);
        }
        return new InvalidTokenResponse('The token does not match any user.');
      }
      ctx.user = user;
    }

    return async (response: HttpResponse) => {
      if (session.isDestroyed) {
        if (options.cookie) {
          removeSessionCookie(response);
        }
        return;
      }

      if (session.isModified) {
        await store.update(session.getState());
      } else {
        await store.extendLifeTime(session.getState().id);
      }
      if (options.cookie) {
        setSessionCookie(response, session.getToken());
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

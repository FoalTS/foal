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
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  IApiSecurityScheme,
  isHttpResponseInternalServerError,
  ServiceManager,
  Logger
} from '../../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { checkUserIdType } from './check-user-id-type';
import { getSessionIDFromRequest, RequestValidationError } from './get-session-id-from-request';
import { createSession, readSession, SessionStore } from '../core';
import { getCsrfTokenFromRequest, removeSessionCookie, setSessionCookie, shouldVerifyCsrfToken } from './utils';

export type UseSessionOptions = {
  store?: Class<SessionStore>;
  cookie?: boolean;
  csrf?: boolean;
  redirectTo?: string;
  openapi?: boolean;
  required?: boolean;
  create?: boolean;
  userCookie?: (ctx: Context, services: ServiceManager) => string|Promise<string>;
} & (
  {
    userIdType: 'string';
    user?: (id: string, services: ServiceManager) => Promise<Context['user']>;
  } |
  {
    userIdType?: 'number';
    user?: (id: number, services: ServiceManager) => Promise<Context['user']>;
  }
);

export function UseSessions(options: UseSessionOptions = {}): HookDecorator {

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

    async function postFunction(response: HttpResponse) {
      if (!(ctx.session) || isHttpResponseInternalServerError(response)) {
        return;
      }

      if (ctx.session.isDestroyed) {
        if (options.cookie) {
          removeSessionCookie(response, !!options.userCookie);
        }
        return;
      }

      await ctx.session.commit();

      if (options.cookie) {
        const userCookie = options.userCookie ? await options.userCookie(ctx, services) : undefined;
        setSessionCookie(response, ctx.session, userCookie);
      }
    }

    /* Validate the request */

    let sessionID: string|undefined;

    try {
      sessionID = getSessionIDFromRequest(ctx.request, options.cookie ? 'token-in-cookie' : 'token-in-header', !!options.required);
    } catch (error) {
      if (error instanceof RequestValidationError) {
        return badRequestOrRedirect(error.message);
      }
      // TODO: test this.
      throw error;
    }

    if (!sessionID) {
      if (options.create ?? options.cookie) {
        ctx.session = await createSession(store);
      }
      return postFunction;
    }

    /* Verify the session ID */

    const session = await readSession(store, sessionID);

    if (!session) {
      const response = unauthorizedOrRedirect('token invalid or expired');
      if (options.cookie) {
        removeSessionCookie(response, !!options.userCookie);
      }
      return response;
    }

    /* Verify CSRF token */

    if (shouldVerifyCsrfToken(ctx.request, options)) {
      const expectedCsrftoken = session.get<string|undefined>('csrfToken');
      if (!expectedCsrftoken) {
        throw new Error(
          'Unexpected error: the session content does not have a "csrfToken" field. '
          + 'Are you sure you created the session with "createSession"?'
        );
      }
      const actualCsrfToken = getCsrfTokenFromRequest(ctx.request);
      if (actualCsrfToken !== expectedCsrftoken) {
        return new HttpResponseForbidden('CSRF token missing or incorrect.');
      }
    }

    /* Set ctx.session */

    ctx.session = session;

    /* Set ctx.user */

    const logger = services.get(Logger);
    logger.addLogContext({ userId: session.userId });

    if (session.userId !== null && options.user) {
      const userId = checkUserIdType(session.userId, options.userIdType);
      ctx.user = await options.user(userId as never, services);
      if (!ctx.user) {
        await session.destroy();
        const response = unauthorizedOrRedirect('The token does not match any user.');
        if (options.cookie) {
          removeSessionCookie(response, !!options.userCookie);
        }
        return response;
      }
    }

    return postFunction;
  }

  const openapi = [
    options.required ?
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
    if (options.required) {
      openapi.push(ApiSecurityRequirement({ cookieAuth: [] }));
    }
    if (Config.get('settings.session.csrf.enabled', 'boolean', false)) {
      openapi.push(ApiResponse(403, { description: 'CSRF token is missing or incorrect.' }));
    }
  } else {
    const securityScheme: IApiSecurityScheme = {
      scheme: 'bearer',
      type: 'http',
    };
    openapi.push(ApiDefineSecurityScheme('bearerAuth', securityScheme));
    if (options.required) {
      openapi.push(ApiSecurityRequirement({ bearerAuth: [] }));
    }
  }

  return Hook(hook, openapi, { openapi: options.openapi });
}

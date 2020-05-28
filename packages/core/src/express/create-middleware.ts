// FoalTS
import {
  Context,
  HookPostFunction,
  HttpResponse,
  isHttpResponse,
  Route,
  ServiceManager
} from '../core';
import { sendResponse } from './send-response';

/**
 * Create an express middleware from a Route and the application services.
 *
 * @export
 * @param {Route} route - The route object.
 * @param {ServiceManager} services - The application services.
 * @returns {(...args) => any} The express middleware.
 */
export function createMiddleware(route: Route, services: ServiceManager) {
  return async (req: any, res: any, next: (err?: any) => any) => {
    try {
      const ctx = new Context(req);
      req.foal = { ctx };

      let response: undefined | HttpResponse;

      const hookPostFunctions: HookPostFunction[] = [];

      for (const hook of route.hooks) {
        const result = await hook(ctx, services);
        if (isHttpResponse(result)) {
          response = result;
          break;
        } else if (typeof result === 'function') {
          hookPostFunctions.unshift(result);
        }
      }

      if (!isHttpResponse(response)) {
        response = await route.controller[route.propertyKey](ctx, ctx.request.params, ctx.request.body);
      }

      if (!isHttpResponse(response)) {
        throw new Error(`The controller method "${route.propertyKey}" should return an HttpResponse.`);
      }

      for (const postFn of hookPostFunctions) {
        await postFn(response);
      }

      sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  };
}

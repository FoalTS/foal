import {
  Context,
  HookPostFunction,
  HttpResponse,
  isHttpResponse,
  isHttpResponseRedirect,
  Route,
  ServiceManager
} from '../core';

/**
 * Create an express middleware from a Route and the application services.
 *
 * @export
 * @param {Route} route - The route object.
 * @param {ServiceManager} services - The application services.
 * @returns {(...args) => any} The express middleware.
 */
export function createMiddleware(route: Route, services: ServiceManager): (...args) => any {
  return async (req, res, next) => {
    try {
      const ctx = new Context(req);
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
        response = await route.controller[route.propertyKey](ctx);
      }

      if (!isHttpResponse(response)) {
        throw new Error(`The controller method "${route.propertyKey}" should return an HttpResponse.`);
      }

      for (const postFn of hookPostFunctions) {
        await postFn(ctx, services, response);
      }

      res.status(response.statusCode);
      res.set(response.getHeaders());
      const cookies = response.getCookies();
      // tslint:disable-next-line:forin
      for (const cookieName in cookies) {
        res.cookie(cookieName, cookies[cookieName].value, cookies[cookieName].options);
      }

      if (isHttpResponseRedirect(response)) {
        res.redirect(response.path);
        return;
      }

      if (typeof response.body === 'number') {
        response.body = response.body.toString();
      }
      res.send(response.body);
    } catch (err) {
      next(err);
    }
  };
}

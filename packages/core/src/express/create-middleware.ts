import {
  Context,
  HookPostFunction,
  HttpResponse,
  isHttpResponse,
  isHttpResponseMovedPermanently,
  isHttpResponseRedirect,
  Route,
  ServiceManager
} from '../core';

import { utils } from 'realm-utils';

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
        const requiredParams = utils.getParameterNamesFromFunction(route.controller[route.propertyKey]);
        const params = {
            ctx,
            context: ctx,
            ...ctx.request.params
        };

        let args = requiredParams.map(param => params[param]);
        if (args.length === 0) {
            args = [ctx]
        }

        response = await route.controller[route.propertyKey](...args);
      }

      if (!isHttpResponse(response)) {
        throw new Error(`The controller method "${route.propertyKey}" should return an HttpResponse.`);
      }

      for (const postFn of hookPostFunctions) {
        await postFn(response);
      }

      res.status(response.statusCode);
      res.set(response.getHeaders());
      const cookies = response.getCookies();
      // tslint:disable-next-line:forin
      for (const cookieName in cookies) {
        const options = cookies[cookieName].options;
        if (options.maxAge !== undefined) {
          // Convert seconds to milliseconds to make it work with Express.
          options.maxAge = options.maxAge * 1000;
        }
        res.cookie(cookieName, cookies[cookieName].value, options);
      }

      if (isHttpResponseRedirect(response) || isHttpResponseMovedPermanently(response)) {
        res.redirect(response.statusCode, response.path);
        return;
      }

      if (typeof response.body === 'number') {
        response.body = response.body.toString();
      }

      if (response.stream === true) {
        response.body.pipe(res);
        return;
      }

      res.send(response.body);
    } catch (err) {
      next(err);
    }
  };
}

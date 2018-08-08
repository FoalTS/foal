import {
  Context,
  isHttpResponse,
  isHttpResponseRedirect,
  Route,
  ServiceManager
} from '../core';

export function createMiddleware(route: Route, services: ServiceManager): (...args) => any {
  return async (req, res, next) => {
    try {
      const ctx = new Context(req);
      let response;
      for (const hook of route.hooks) {
        response = await hook(ctx, services);
        if (isHttpResponse(response)) {
          break;
        }
      }
      if (!isHttpResponse(response)) {
        response = await route.controller[route.propertyKey](ctx);
      }

      if (!isHttpResponse(response)) {
        throw new Error(`The controller method "${route.propertyKey}" should return an HttpResponse.`);
      }

      res.set(response.headers);
      res.status(response.statusCode);

      if (isHttpResponseRedirect(response)) {
        res.redirect(response.path);
        return;
      }

      if (typeof response.content === 'number') {
        response.content = response.content.toString();
      }
      res.send(response.content);
    } catch (err) {
      next(err);
    }
  };
}

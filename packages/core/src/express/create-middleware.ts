import {
  Context,
  HttpResponse,
  HttpResponseRedirect,
  isHttpResponse,
  isHttpResponseRedirect,
  RouteData,
  ServiceManager
} from '../core';

export function createMiddleware(route: RouteData, services: ServiceManager): (...args) => any {
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

      res.set((response as HttpResponse).headers);
      res.status((response as HttpResponse).statusCode);

      if (isHttpResponseRedirect(response)) {
        res.redirect((response as HttpResponseRedirect).path);
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

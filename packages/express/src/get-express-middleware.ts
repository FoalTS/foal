import { Context, HttpResponseRedirect, Route, ServiceManager, HttpResponse, HttpResponseOK } from '@foal/core';
import { Router } from 'express';

import { ExpressMiddleware } from './interfaces';

function makeContext(req): Context {
  return {
    body: req.body,
    getHeader: req.get.bind(req),
    params: req.params,
    query: req.query,
    result: undefined,
    session: req.session,
    state: {},
    user: req.user,
  };
}

export function getExpressMiddleware(route: Route, services: ServiceManager,
                                     stateDef: { req: string, ctx: string }[] = []): ExpressMiddleware {
  async function handler(req, res) {
    const ctx = makeContext(req);
    stateDef.forEach(e => ctx.state[e.ctx] = req[e.req]);

    for (const hook of route.preHooks.concat(route.middleHook)) {
      const result = await hook(ctx, services);
      if (result instanceof HttpResponse) {
        ctx.result = result;
        break;
      }
    }

    for (const hook of route.postHooks) {
      await hook(ctx, services);
    }

    if (!(ctx.result instanceof HttpResponse)) {
      console.log('The result of the context should be an HttpResponse.');
      ctx.result = new HttpResponseOK(ctx.result);
    }

    if (ctx.result instanceof HttpResponseRedirect) {
      res.redirect(ctx.result.path);
      return;
    }
    if (typeof ctx.result.content === 'number') {
      ctx.result.content = ctx.result.content.toString();
    }
    res.status((ctx.result as HttpResponse).statusCode)
       .send((ctx.result as HttpResponse).content);
  }

  const expressMiddleware = (req, res, next) => {
    handler(req, res).catch(err => next(err));
  };

  const path = route.path || '/';
  const router = Router();

  switch (route.httpMethod) {
    case 'DELETE':
      router.delete(path, expressMiddleware);
      break;
    case 'GET':
      router.get(path, expressMiddleware);
      break;
    case 'PATCH':
      router.patch(path, expressMiddleware);
      break;
    case 'POST':
      router.post(path, expressMiddleware);
      break;
    case 'PUT':
      router.put(path, expressMiddleware);
      break;
  }

  return router;
}

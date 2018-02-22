import { Context, HttpResponseRedirect, ReducedRoute } from '@foal/core';
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

export function getExpressMiddleware(route: ReducedRoute,
                                     stateDef: { req: string, ctx: string }[] = []): ExpressMiddleware {
  async function handler(req, res) {
    const ctx = makeContext(req);
    stateDef.forEach(e => ctx.state[e.ctx] = req[e.req]);
    for (const middleware of route.middlewares) {
      await middleware(ctx);
    }
    if (ctx.result instanceof HttpResponseRedirect) {
      res.redirect(ctx.result.path);
      return;
    }
    if (typeof ctx.result === 'number') {
      ctx.result = ctx.result.toString();
    }
    res.status(route.successStatus).send(ctx.result);
  }

  const expressMiddleware = (req, res, next) => {
    handler(req, res).catch(err => next(err));
  };

  const path = route.paths.join('/').replace(/(\/)+/g, '/') || '/';
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

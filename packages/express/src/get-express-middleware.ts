import { HttpError, MethodBinding } from '@foal/core';
import { Router } from 'express';

import { ExpressMiddleware } from './interfaces';

export function getExpressMiddleware(methodBinding: MethodBinding): ExpressMiddleware {
  const middleware: ExpressMiddleware = async (req, res, next) => {
    const ctx: any = {
      data: req.body,
      id: req.params.id,
      params: {
        query: req.query
      }
    };
    try {
      for (const middleware of methodBinding.middlewares) {
        await middleware(ctx);
      }
      if (typeof ctx.result === 'number') {
        ctx.result = ctx.result.toString();
      }
      res.status(methodBinding.successStatus).send(ctx.result);
    } catch (err) {
      if (err instanceof HttpError) {
        res.sendStatus(err.statusCode);
      } else {
        console.error(err);
        res.sendStatus(500);
      }
    }
  };

  const path = methodBinding.paths.join('/').replace(/(\/)+/g, '/') || '/';
  const router = Router();

  switch (methodBinding.httpMethod) {
    case 'DELETE':
      router.delete(path, middleware);
      break;
    case 'GET':
      router.get(path, middleware);
      break;
    case 'PATCH':
      router.patch(path, middleware);
      break;
    case 'POST':
      router.post(path, middleware);
      break;
    case 'PUT':
      router.put(path, middleware);
      break;
  }

  return router;
}

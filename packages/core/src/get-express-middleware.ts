import * as express from 'express';

import { HttpError } from './controllers/errors';
import { Context, ExpressMiddleware } from './controllers/interfaces';
import { Foal } from './foal';

function initContext(req: any): Context {
  return {
    data: req.body,
    id: req.params.id,
    params: {
      query: req.query
    }
  };
}

export function getExpressMiddleware(foal: Foal): ExpressMiddleware {
  const router = express.Router();
  for (const methodBinding of foal.methodsBindings) {
    const path = methodBinding.paths.join('/').replace(/\/\//g, '/');
    router[methodBinding.httpMethod.toLowerCase()](path, async (req, res) => {
      const context = initContext(req);
      try {
        for (const middleware of methodBinding.middlewares) {
          await middleware(context);
        }
        const result = context.result;
        if (typeof result === 'undefined') {
          res.sendStatus(methodBinding.successStatus);
        } else {
          res.status(methodBinding.successStatus).send(typeof result === 'number' ? result.toString() : result);
        }
      } catch (error) {
        if (error instanceof HttpError) {
          res.sendStatus(error.statusCode);
        } else {
          console.error(error);
          res.sendStatus(500);
        }
      }
    });
  }
  return router;
}

import { HttpError } from '../errors';
import { ExpressMiddleware } from '../interfaces';

export function catchErrors(middleware: ExpressMiddleware): ExpressMiddleware {
  return async (req, res, next) => {
    try {
      // Add await to suppor promise errors. Nothing happens if middleware
      // does not return a promise.
      await middleware(req, res, next);
    } catch (error) {
      if (error instanceof HttpError) {
        res.sendStatus(error.statusCode);
      } else {
        console.error(error);
        res.sendStatus(500);
      }
    }
  };
}

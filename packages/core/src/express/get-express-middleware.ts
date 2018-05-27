import {
  PostContext,
  Route,
  ServiceManager,
} from '../core';
import { getResponse, sendResponse } from './utils';

export function getExpressMiddleware(route: Route, services: ServiceManager,
                                     stateDef: { req: string, state: string }[]) {
  return async (req, res, next) => {
    try {
      const ctx = new PostContext(req, stateDef);
      const response = await getResponse(route, ctx, services);
      if (response) {
        sendResponse(res, response);
      }
    } catch (err) {
      next(err);
    }
  };
}

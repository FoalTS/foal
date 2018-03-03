import {
  Context,
  HttpResponse,
  HttpResponseOK,
  HttpResponseRedirect,
  PostContext,
  Route,
  ServiceManager,
  HttpResponseInternalServerError,
  HttpResponseSuccess
} from '@foal/core';
import { getContext, getResponse, sendResponse } from './utils';

export function getExpressMiddleware(route: Route, services: ServiceManager,
                                     stateDef: { req: string, state: string }[]) {
  return async (req, res, next) => {
    try {
      const ctx = getContext(req, stateDef);
      const response = await getResponse(route, ctx, services);
      if (response) {
        sendResponse(res, response);
      }
    } catch (err) {
      next(err);
    }
  };
}

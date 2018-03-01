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
import { Router } from 'express';

function getContext(req, stateDef: { req: string, ctx: string }[]): PostContext {
  const context = {
    body: req.body,
    getHeader: req.get.bind(req),
    params: req.params,
    query: req.query,
    result: undefined,
    session: req.session,
    state: {},
    user: req.user,
  };
  stateDef.forEach(e => context.state[e.ctx] = req[e.req]);
  return context;
}

async function getResponse(route: Route, ctx: PostContext,
                           services: ServiceManager): Promise<void | HttpResponse> {
  for (const preHook of route.preHooks.concat(route.handler)) {
    const result = await preHook(ctx, services);
    if (result instanceof HttpResponse) {
      ctx.result = result;
      break;
    }
  }

  for (const postHook of route.postHooks) {
    await postHook(ctx, services);
  }

  return ctx.result;
}

function sendResponse(res, response: HttpResponse) {
  if (response instanceof HttpResponseSuccess) {
    if (typeof response.content === 'number') {
      response.content = response.content.toString();
    }
    if (response.content) {
      res.status(response.statusCode).send(response.content);
    } else {
      res.sendStatus(response.statusCode);
    }
  }
  else if (response instanceof HttpResponseRedirect) {
    res.redirect(response.path);
  }
}

export function getExpressMiddleware(route: Route, services: ServiceManager,
                                     stateDef: { req: string, ctx: string }[]) {
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

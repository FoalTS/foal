import { App } from '@foal/core';
import { Router } from 'express';

import { getExpressMiddleware } from './get-express-middleware';

export function getCallback(app: App, stateDef: { req: string, ctx: string }[] = []) {
  const router = Router();
  for (const controller of app.controllers) {
    for (const route of controller.getRoutes()) {
      router.use(getExpressMiddleware(route, app.services, stateDef));
    }
  }
  return router;
}

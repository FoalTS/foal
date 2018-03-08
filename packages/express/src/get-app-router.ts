import { App } from '@foal/core';
import { Router } from 'express';

import { getExpressMiddleware } from './get-express-middleware';

export function getAppRouter(app: App, stateDef: { req: string, state: string }[] = []) {
  const router = Router();
  for (const controller of app.controllers) {
    for (const route of controller.getRoutes()) {
      switch (route.httpMethod) {
        case 'DELETE':
          router.delete(route.path, getExpressMiddleware(route, app.services, stateDef));
          break;
        case 'GET':
          router.get(route.path, getExpressMiddleware(route, app.services, stateDef));
          break;
        case 'PATCH':
          router.patch(route.path, getExpressMiddleware(route, app.services, stateDef));
          break;
        case 'POST':
          router.post(route.path, getExpressMiddleware(route, app.services, stateDef));
          break;
        case 'PUT':
          router.put(route.path, getExpressMiddleware(route, app.services, stateDef));
          break;
      }
    }
  }
  return router;
}

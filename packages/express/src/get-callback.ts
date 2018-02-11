import { Foal } from '@foal/core';
import { Router } from 'express';

import { getExpressMiddleware } from './get-express-middleware';

export function getCallback(foal: Foal, stateDef: { req: string, ctx: string }[] = []) {
  const router = Router();
  for (const route of foal.routes) {
    router.use(getExpressMiddleware(route, stateDef));
  }
  return router;
}

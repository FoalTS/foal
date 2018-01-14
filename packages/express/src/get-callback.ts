import { Foal } from '@foal/core';
import { Router } from 'express';

import { getExpressMiddleware } from './get-express-middleware';

// Test: should return 404 if no route exists for the given method and path.
export function getCallback(foal: Foal) {
  const router = Router();
  for (const route of foal.routes) {
    router.use(getExpressMiddleware(route));
  }
  return router;
}

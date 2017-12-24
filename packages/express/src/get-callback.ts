import { Foal } from '@foal/core';
import { Router } from 'express';

import { getExpressMiddleware } from './get-express-middleware';

// Test: should return 404 if no lowLevelRoute exists for the given method and path.
export function getCallback(foal: Foal) {
  const router = Router();
  for (const lowLevelRoute of foal.lowLevelRoutes) {
    router.use(getExpressMiddleware(lowLevelRoute));
  }
  return router;
}

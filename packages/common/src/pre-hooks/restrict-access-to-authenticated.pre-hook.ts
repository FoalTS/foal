import {
  Context,
  preHook,
  PreMiddleware,
  UnauthorizedError
} from '@foal/core';

export function makeRestrictAccessToAuthenticatedMiddleware(): PreMiddleware {
  return function restrictAccessToAuthenticatedMiddleware(ctx: Context): void {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
  };
}

export function restrictAccessToAuthenticated() {
  return preHook(makeRestrictAccessToAuthenticatedMiddleware());
}

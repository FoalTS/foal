import {
  Context,
  ForbiddenError,
  preHook,
  PreMiddleware,
  UnauthorizedError
} from '@foal/core';

export function makeRestrictAccessToAdminMiddleware(): PreMiddleware {
  return function restrictAccessToAdminMiddleware(ctx: Context): void {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
    if (!ctx.user.isAdmin) {
      throw new ForbiddenError();
    }
  };
}

export function restrictAccessToAdmin() {
  return preHook(makeRestrictAccessToAdminMiddleware());
}

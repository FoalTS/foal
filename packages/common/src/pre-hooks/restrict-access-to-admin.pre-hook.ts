import {
  ForbiddenError,
  preHook,
  UnauthorizedError
} from '@foal/core';

export function restrictAccessToAdmin() {
  return preHook(ctx => {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
    if (!ctx.user.isAdmin) {
      throw new ForbiddenError();
    }
  });
}

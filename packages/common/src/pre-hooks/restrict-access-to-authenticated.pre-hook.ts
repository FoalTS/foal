import {
  preHook,
  UnauthorizedError
} from '@foal/core';

export function restrictAccessToAuthenticated() {
  return preHook(ctx => {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
  });
}

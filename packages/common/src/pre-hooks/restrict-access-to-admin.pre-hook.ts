import {
  HttpResponseForbidden,
  preHook,
  HttpResponseUnauthorized
} from '@foal/core';

export function restrictAccessToAdmin() {
  return preHook(ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.isAdmin) {
      return new HttpResponseForbidden();
    }
  });
}

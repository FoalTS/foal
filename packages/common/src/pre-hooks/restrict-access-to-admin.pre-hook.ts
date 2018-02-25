import {
  PreHook,
  HttpResponseForbidden,
  HttpResponseUnauthorized
} from '@foal/core';

export function restrictAccessToAdmin(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.isAdmin) {
      return new HttpResponseForbidden();
    }
  };
}

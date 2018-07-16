import {
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  PreHook,
} from '../../core';

export function restrictAccessToAdmin(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.hasPerm('admin')) {
      return new HttpResponseForbidden();
    }
  };
}

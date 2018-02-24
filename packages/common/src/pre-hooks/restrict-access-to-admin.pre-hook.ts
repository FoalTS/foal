import {
  HttpResponseForbidden,
  Hook,
  HttpResponseUnauthorized
} from '@foal/core';

export function restrictAccessToAdmin(): Hook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.isAdmin) {
      return new HttpResponseForbidden();
    }
  };
}

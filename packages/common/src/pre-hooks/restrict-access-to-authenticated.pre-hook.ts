import {
  Hook,
  HttpResponseUnauthorized,
} from '@foal/core';

export function restrictAccessToAuthenticated(): Hook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  };
}

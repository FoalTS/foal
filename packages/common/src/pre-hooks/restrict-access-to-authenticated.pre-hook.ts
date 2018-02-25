import {
  PreHook,
  HttpResponseUnauthorized,
} from '@foal/core';

export function restrictAccessToAuthenticated(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  };
}

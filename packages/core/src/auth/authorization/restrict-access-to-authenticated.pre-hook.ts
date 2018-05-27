import {
  HttpResponseUnauthorized,
  PreHook,
} from '../../core';

export function restrictAccessToAuthenticated(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  };
}

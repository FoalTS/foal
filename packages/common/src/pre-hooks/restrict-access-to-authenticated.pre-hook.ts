import {
  preHook,
  HttpResponseUnauthorized
} from '@foal/core';

export function restrictAccessToAuthenticated() {
  return preHook(ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  });
}

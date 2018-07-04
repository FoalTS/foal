import {
  HttpResponseUnauthorized,
  PreHook,
} from '../../core';

export function LoginRequired(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  };
}

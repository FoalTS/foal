import {
  Hook,
  HookDecorator,
  HttpResponseUnauthorized,
} from '../../core';

export function LoginRequired(): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  });
}

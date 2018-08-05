import {
  Hook,
  HookDecorator,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../core';

export function LoginRequired(options: { redirect?: string } = {}): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      if (options.redirect) {
        return new HttpResponseRedirect(options.redirect);
      }
      return new HttpResponseUnauthorized();
    }
  });
}

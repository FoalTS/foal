import {
  Hook,
  HookDecorator,
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../core';

export function PermissionRequired(perm: string, options: { redirect?: string } = {}): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      if (options.redirect) {
        return new HttpResponseRedirect(options.redirect);
      }
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.hasPerm(perm)) {
      return new HttpResponseForbidden();
    }
  });
}

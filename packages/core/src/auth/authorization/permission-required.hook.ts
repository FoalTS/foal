import {
  Hook,
  HookDecorator,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
} from '../../core';

export function PermissionRequired(perm: string): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.hasPerm(perm)) {
      return new HttpResponseForbidden();
    }
  });
}

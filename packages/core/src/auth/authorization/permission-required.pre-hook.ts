import {
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  PreHook,
} from '../../core';

export function PermissionRequired(perm: string): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.hasPerm(perm)) {
      return new HttpResponseForbidden();
    }
  };
}

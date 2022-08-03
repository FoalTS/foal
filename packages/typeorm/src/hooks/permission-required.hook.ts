// 3p
import {
  Context,
  Hook,
  HookDecorator,
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '@foal/core';
import { IUserWithPermissions } from './user-with-permissions.interface';

/**
 * Hook factory to check if a user can access a route based on their permissions.
 *
 * This function uses `UserWithPermissions.hasPerm` under the hood.  It is very likely
 * that you have to use the `fetchUserWithPermissions` function when using this hook.
 *
 * @export
 * @param {string} perm - The name of the permission.
 * @param {{ redirect?: string }} [options={}] - Hook options.
 * @param {string|undefined} options.redirect - Optional URL path to redirect users that
 * do not have the right permission.
 * @returns {HookDecorator} - The hook.
 */
export function PermissionRequired(perm: string, options: { redirect?: string } = {}): HookDecorator {
  return Hook((ctx: Context<IUserWithPermissions|null>) => {
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

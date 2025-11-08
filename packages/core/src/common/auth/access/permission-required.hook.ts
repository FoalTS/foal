// 3p
import {
  ApiResponse,
  Context,
  Hook,
  HookDecorator,
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../../core';
import { IUserWithPermissions } from './user-with-permissions.interface';

/**
 * Hook factory to check if a user can access a route based on their permissions.
 *
 * The `ctx.user` object must implement the `IUserWithPermissions` interface.
 *
 * @export
 * @param {string} perm - The name of the permission.
 * @param {{ redirect?: string, openapi?: boolean }} [options={}] - Hook options.
 * @param {string|undefined} options.redirect - Optional URL path to redirect users that
 * do not have the right permission.
 * @param {boolean|undefined} options.openapi - Add OpenAPI metadata.
 * @returns {HookDecorator} - The hook.
 */
export function PermissionRequired(perm: string, options: { redirect?: string, openapi?: boolean } = {}): HookDecorator {
  function hook(ctx: Context<IUserWithPermissions|null>) {
    if (!ctx.user) {
      if (options.redirect) {
        return new HttpResponseRedirect(options.redirect);
      }
      return new HttpResponseUnauthorized();
    }
    if (typeof ctx.user.hasPerm !== 'function') {
      throw new Error('ctx.user does not have a "hasPerm" method. Are you sure it implements the IUserWithPermissions interface?')
    }
    if (!ctx.user.hasPerm(perm)) {
      return new HttpResponseForbidden();
    }
  }

  const openapi = [
    options.redirect ?
      ApiResponse(302, { description: 'Unauthenticated request.' }) :
      ApiResponse(401, { description: 'Unauthenticated request.' }),
    ApiResponse(403, { description: 'Permission denied.' })
  ];

  return Hook(hook, openapi, { openapi: options.openapi });
}

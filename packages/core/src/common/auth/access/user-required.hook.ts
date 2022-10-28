import { ApiResponse, Context, Hook, HookDecorator, HttpResponseRedirect, HttpResponseUnauthorized } from '../../../core';

export function UserRequired(options: { redirectTo?: string, openapi?: boolean } = {}): HookDecorator {
  function hook(ctx: Context) {
    if (!ctx.user) {
      if (options.redirectTo) {
        return new HttpResponseRedirect(options.redirectTo);
      }
      return new HttpResponseUnauthorized();
    }
  }

  const openapi = [
    options.redirectTo ?
      ApiResponse(302, { description: 'Unauthenticated request.' }) :
      ApiResponse(401, { description: 'Unauthenticated request.' })
  ];

  return Hook(hook, openapi, { openapi: options.openapi });
}

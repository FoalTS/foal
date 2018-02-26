import { ModelService, ObjectDoesNotExist } from '@foal/common';
import { Class, PreHook } from '@foal/core';

export function authenticate(UserModelService: Class<ModelService<any, any, any, any>>): PreHook {
  return async (ctx, services) => {
    if (!ctx.session) {
      throw new Error('authenticate pre-hook requires session management.');
    }
    if (!ctx.session.authentication || !ctx.session.authentication.hasOwnProperty('userId')) {
      return;
    }
    try {
      ctx.user = await services.get(UserModelService).findById(ctx.session.authentication.userId);
    } catch (err) {
      if (!(err instanceof ObjectDoesNotExist)) {
        throw err;
      }
    }
  };
}

import { preHook, Type, NotFoundError } from '@foal/core';
import { ModelService } from '@foal/common';

export function authenticate(UserModelService: Type<ModelService<any, any, any, any>>) {
  return preHook(async (ctx, services) => {
    if (!ctx.session) {
      throw new Error('authenticate pre-hook requires session management.')
    }
    if (!ctx.session.authentication || !ctx.session.authentication.hasOwnProperty('userId')) {
      return;
    }
    try {
      ctx.user = await services.get(UserModelService).findById(ctx.session.authentication.userId);
    } catch(err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }
  });
}

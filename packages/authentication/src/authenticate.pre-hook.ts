import { ModelService, ObjectDoesNotExist } from '@foal/common';
import { preHook, Type} from '@foal/core';

export function authenticate(UserModelService: Type<ModelService<any, any, any, any>>) {
  return preHook(async (ctx, services) => {
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
  });
}

import { Hook, HookDecorator } from '../../core';

export function restrictBodyAndQueryToAuthenticated(): HookDecorator {
  return Hook((ctx, services) => {
    if (!ctx.user) {
      throw new Error('No user is authenticated.');
    }
    if (typeof ctx.request.body === 'object' && ctx.request.body !== null) {
      ctx.request.body.userId = ctx.user.id;
    }
    ctx.state.query = { ...ctx.state.query, userId: ctx.user.id };
  });
}

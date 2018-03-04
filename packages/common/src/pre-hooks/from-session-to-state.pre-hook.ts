import { preHook } from '@foal/core';

export function fromSessionToState(propertyName: string) {
  return preHook(ctx => {
    ctx.state[propertyName] = ctx.session[propertyName];
  });
}

import { postHook } from '@foal/core';

export function afterThatRemoveField(name: string) {
  return postHook(ctx => {
    if (Array.isArray(ctx.result)) {
      for (const item of ctx.result) {
        delete item[name];
      }
    } else {
      delete ctx.result[name];
    }
  });
}

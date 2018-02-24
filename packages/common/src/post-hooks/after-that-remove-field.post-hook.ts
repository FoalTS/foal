import { Hook } from '@foal/core';

export function afterThatRemoveField(name: string): Hook {
  return ctx => {
    if (Array.isArray(ctx.result)) {
      for (const item of ctx.result) {
        delete item[name];
      }
    } else {
      delete ctx.result[name];
    }
  };
}

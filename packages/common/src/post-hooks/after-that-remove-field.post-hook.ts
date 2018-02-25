import { PostHook, HttpResponseSuccess } from '@foal/core';

export function afterThatRemoveField(name: string): PostHook {
  return ctx => {
    if (!(ctx.result instanceof HttpResponseSuccess && ctx.result.content)) {
      return;
    }
    if (Array.isArray(ctx.result.content)) {
      for (const item of ctx.result.content) {
        delete item[name];
      }
    } else {
      delete ctx.result.content[name];
    }
  };
}

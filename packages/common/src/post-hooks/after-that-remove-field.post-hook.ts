import { HttpResponseSuccess, isHttpResponseSuccess, PostHook } from '@foal/core';

export function afterThatRemoveField(name: string): PostHook {
  return ctx => {
    if (!(ctx.result && isHttpResponseSuccess(ctx.result) && (ctx.result as HttpResponseSuccess).content)) {
      return;
    }
    if (Array.isArray((ctx.result as HttpResponseSuccess).content)) {
      for (const item of (ctx.result as HttpResponseSuccess).content) {
        delete item[name];
      }
    } else {
      delete (ctx.result as HttpResponseSuccess).content[name];
    }
  };
}

import { HttpResponseSuccess, isHttpResponseSuccess, PostHook } from '../../core';

export function onSuccessRemoveField(name: string): PostHook {
  return ctx => {
    if (!(ctx.response && isHttpResponseSuccess(ctx.response) && (ctx.response as HttpResponseSuccess).content)) {
      return;
    }
    if (Array.isArray((ctx.response as HttpResponseSuccess).content)) {
      for (const item of (ctx.response as HttpResponseSuccess).content) {
        delete item[name];
      }
    } else {
      delete (ctx.response as HttpResponseSuccess).content[name];
    }
  };
}

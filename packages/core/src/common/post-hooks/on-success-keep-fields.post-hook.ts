import { isHttpResponseSuccess, PostHook } from '../../core';

function fromFields(o: object, fields: string[]) {
  const result = {};
  for (const field of fields) {
    if (o.hasOwnProperty(field)) {
      result[field] = o[field];
    }
  }
  return result;
}

export function onSuccessKeepFields<ResourceClass = any>(fields: (keyof ResourceClass)[]): PostHook {
  return (ctx, services) => {
    if (!ctx.response || !isHttpResponseSuccess(ctx.response) || !ctx.response.content) {
      return;
    }
    if (Array.isArray(ctx.response.content)) {
      ctx.response.content = ctx.response.content.map(item => fromFields(item, fields as string[]));
    } else {
      ctx.response.content = fromFields(ctx.response.content, fields as string[]);
    }
  };
}

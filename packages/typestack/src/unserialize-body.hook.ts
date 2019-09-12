import { Class, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';

export function UnserializeBody(cls: Class, options?: ClassTransformOptions): HookDecorator {
  return Hook(ctx => {
    if (typeof ctx.request.body !== 'object' || ctx.request.body === null) {
      return new HttpResponseBadRequest({
        message: 'The request body should be a valid JSON object or array.'
      });
    }
    ctx.request.body = plainToClass(cls, ctx.request.body, options);
  });
}

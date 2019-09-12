import { Class, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

export interface ValidateBodyOptions {
  transformer?: ClassTransformOptions;
  validator?: ValidatorOptions;
}

export function ValidateBody(cls: Class, options: ValidateBodyOptions = {}): HookDecorator {
  return Hook(async ctx => {
    if (typeof ctx.request.body !== 'object' || ctx.request.body === null) {
      return new HttpResponseBadRequest({
        message: 'The request body should be a valid JSON object or array.'
      });
    }
    const instance = plainToClass(cls, ctx.request.body, options.transformer);
    const errors = await validate(instance, options.validator);
    if (errors.length > 0) {
      return new HttpResponseBadRequest(errors);
    }
    ctx.request.body = instance;
  });
}

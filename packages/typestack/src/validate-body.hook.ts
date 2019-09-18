import { Class, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

export interface ValidateBodyOptions {
  transformer?: ClassTransformOptions;
  validator?: ValidatorOptions;
}

/**
 * Hook factory validating the request body against a validator class. It also transforms
 * the request body into an instance of the class.
 *
 * @export
 * @param {Class} cls - The validator class (see `class-validator` and `class-tranformer` packages).
 * @param {ValidateBodyOptions} [options={}] - Options to pass to the libraries`class-validator`
 * and `class-tranformer`.
 * @returns {HookDecorator} - The hook.
 */
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

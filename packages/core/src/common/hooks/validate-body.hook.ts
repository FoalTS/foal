// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiRequestBody, ApiResponse, IApiRequestBody, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook factory validating the body of the request against a AJV schema.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the body request.
 * @param {{ openapi?: boolean }} [options={}] - Options to add openapi metadata
 * @returns {HookDecorator} - The hook.
 */
export function ValidateBody(
  schema: object | ((controller: any) => object), options: { openapi?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();

  function validate(this: any, ctx: Context) {
    const ajvSchema = typeof schema === 'function' ? schema(this) : schema;
    if (!ajv.validate(ajvSchema, ctx.request.body)) {
      return new HttpResponseBadRequest({ body: ajv.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    function makeRequestBody(schema: IApiSchema): IApiRequestBody {
      return {
        content: {
          'application/json': { schema }
        },
        required: true
      };
    }

    const requestBody = typeof schema === 'function' ? c => makeRequestBody(schema(c)) : makeRequestBody(schema);

    if (propertyKey) {
      ApiRequestBody(requestBody)(target, propertyKey);
    } else {
      ApiRequestBody(requestBody)(target);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}

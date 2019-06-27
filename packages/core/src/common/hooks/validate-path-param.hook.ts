// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiPathParameter } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook - Validate a specific path parameter against an AJV schema.
 *
 * @export
 * @param {string} name - Path parameter name.
 * @param {object} [schema={ type: 'string' }] - Schema used to validate the path parameter.
 * @param {{ openapi?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @returns {HookDecorator} The hook.
 */
export function ValidatePathParam(
  name: string, schema: object = { type: 'string' } , options: { openapi?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();

  function validate(ctx: Context) {
    const paramsSchema = {
      properties: {
        [name]: schema
      },
      required: [ name ],
      type: 'object',
    };
    if (!ajv.validate(paramsSchema, ctx.request.params)) {
      return new HttpResponseBadRequest({ pathParams: ajv.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    const apiPathParameter: IApiPathParameter = {
      in: 'path',
      name,
      required: true,
      schema,
    };

    ApiParameter(apiPathParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}

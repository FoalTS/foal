// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiPathParameter, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook - Validate a specific path parameter against an AJV schema.
 *
 * @export
 * @param {string} name - Path parameter name.
 * @param {(object | ((controller: any) => object))} schema - Schema used to
 * validate the path parameter.
 * @param {{ openapi?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @returns {HookDecorator} The hook.
 */
export function ValidatePathParam(
  name: string,
  schema: object | ((controller: any) => object),
  options: { openapi?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();

  function validate(this: any, ctx: Context) {
    const paramsSchema = {
      properties: {
        [name]: typeof schema === 'function' ? schema(this) : schema
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

    function makeParameter(schema: IApiSchema): IApiPathParameter {
      return { in: 'path', name, required: true, schema };
    }

    const apiPathParameter = typeof schema === 'function' ? c => makeParameter(schema(c)) : makeParameter(schema);

    ApiParameter(apiPathParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}

// FoalTS
import { ValidateFunction } from 'ajv';
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest, ServiceManager } from '../../core';
import { OpenApi } from '../../core/openapi';
import { ApiRequestBody, ApiResponse, IApiRequestBody, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';
import { isFunction } from './is-function.util';

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
  let validateSchema: ValidateFunction|undefined;

  function validate(this: any, ctx: Context, services: ServiceManager) {
    if (!validateSchema) {
      const ajvSchema = isFunction(schema) ? schema(this) : schema;
      const openApi = services.get(OpenApi);
      const components = openApi.getComponents(this);
      validateSchema = ajv.compile({
        ...ajvSchema,
        components
      });
    }
    if (!validateSchema(ctx.request.body)) {
      return new HttpResponseBadRequest({ body: validateSchema.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    // options.openapi ?? Config.get('settings.openapi.useHooks', 'boolean', true)
    if (options.openapi === false ||
      (options.openapi === undefined && !Config.get('settings.openapi.useHooks', 'boolean'))
    ) {
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

    const requestBody = isFunction(schema) ? (c: any) => makeRequestBody(schema(c)) : makeRequestBody(schema);

    if (propertyKey) {
      ApiRequestBody(requestBody)(target, propertyKey);
    } else {
      ApiRequestBody(requestBody)(target);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}

// FoalTS
import {
  ApiParameter,
  ApiResponse,
  Context,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  IApiQueryParameter,
  ServiceManager
} from '../../core';
import { createObjectValidator, extractProperties, isFunction } from './helpers';

/**
 * Hook factory validating the whole query of the request against a AJV schema.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the request query.
 * @param {{ openapi?: boolean }} [options] - Options to add openapi metadata
 * @returns {HookDecorator} - The hook.
 */
export function ValidateQuery(
  schema: object | ((controller: any) => object), options?: { openapi?: boolean }
): HookDecorator {
  const validateObject = createObjectValidator(schema);

  function validate(this: any, ctx: Context, services: ServiceManager) {
    const errors = validateObject.call(this, ctx.request.query, services);
    if (errors) {
      return new HttpResponseBadRequest({ query: errors });
    }
  }

  const openapi = [
    // The schema properties can only be listed as individual OpenAPI parameters when the
    // schema is a plain object. When it is a function, its shape depends on the controller
    // instance and cannot be known while building the class/method decorators.
    ...(isFunction(schema) ? [] : extractProperties(schema).map(property => {
      const apiQueryParameter: IApiQueryParameter = { in: 'query', name: property.name };
      if (property.required) {
        apiQueryParameter.required = true;
      }

      return ApiParameter({
        ...apiQueryParameter,
        schema: property.schema
      });
    })),
    ApiResponse(400, { description: 'Bad request.' })
  ];

  return Hook(validate, openapi, options);
}

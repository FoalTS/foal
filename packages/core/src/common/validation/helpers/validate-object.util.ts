// 3p
import { ValidateFunction } from 'ajv';

// FoalTS
import { OpenApi, ServiceManager } from '../../../core';
import { getAjvInstance } from '../get-ajv-instance';
import { isFunction } from './is-function.util';

/**
 * Create a function that validates a value against an AJV schema.
 *
 * The schema is compiled the first time the returned function is called and
 * then cached for subsequent calls. This is the logic shared by hooks such as
 * ValidateBody and ValidateQuery, which only differ in which part of the
 * request they validate and how they report errors.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the value.
 * @returns {(this: any, value: any, services: ServiceManager) => ValidateFunction['errors'] | null}
 * A function returning the AJV errors if the value is not valid, otherwise null.
 */
export function createObjectValidator(
  schema: object | ((controller: any) => object)
): (this: any, value: any, services: ServiceManager) => ValidateFunction['errors'] | null {
  let validateSchema: ValidateFunction|undefined;

  return function validate(this: any, value: any, services: ServiceManager) {
    if (!validateSchema) {
      const ajvSchema = isFunction(schema) ? schema(this) : schema;
      const components = services.get(OpenApi).getComponents(this);

      validateSchema = getAjvInstance().compile({
        ...ajvSchema,
        components
      });
    }

    return validateSchema(value) ? null : validateSchema.errors;
  };
}

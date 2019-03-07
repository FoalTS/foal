// FoalTS
import { ValidationError } from '../errors';
import { getAjvInstance } from './get-ajv-instance';

/**
 * Validate an object against an AJV schema. If the object is not validated,
 * the function throws a ValidationError with the failure details.
 *
 * @export
 * @param {object} schema - The AJV schema.
 * @param {*} data - The tested data.
 */
export function validate(schema: object, data: any) {
  const ajv = getAjvInstance();
  if (!ajv.validate(schema, data)) {
    throw new ValidationError(ajv.errors);
  }
}

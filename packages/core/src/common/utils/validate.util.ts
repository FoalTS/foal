// FoalTS
import { ValidationError } from '../errors';
import { getAjvInstance } from './get-ajv-instance';

export function validate(schema: object, data: any) {
  const ajv = getAjvInstance();
  if (!ajv.validate(schema, data)) {
    throw new ValidationError(ajv.errors);
  }
}

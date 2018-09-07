// 3p
import * as Ajv from 'ajv';

// FoalTS
import { ValidationError } from '../errors';

const ajv = new Ajv();

export function validate(schema: object, data: any) {
  if (!ajv.validate(schema, data)) {
    throw new ValidationError(ajv.errors);
  }
}

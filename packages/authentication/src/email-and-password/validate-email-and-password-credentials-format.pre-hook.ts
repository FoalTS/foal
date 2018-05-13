import { validate } from '@foal/ajv';
import { PreHook } from '@foal/core';

export function validateEmailAndPasswordCredentialsFormat(): PreHook {
  return validate({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  });
}

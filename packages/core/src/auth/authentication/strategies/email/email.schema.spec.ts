// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import * as Ajv from 'ajv';

// FoalTS
import { emailSchema } from './email.schema';

describe('emailSchema', () => {

  let ajv;
  beforeEach(() => ajv = new Ajv());

  it('should return an error if the email property is missing.', () => {
    const credentials = {
      password: 'myPassword',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '',
        keyword: 'required',
        message: 'should have required property \'email\'',
        params: {
          missingProperty: 'email',
        },
        schemaPath: '#/required',
      }
    ]);
  });

  it('should return an error if the password property is missing.', () => {
    const credentials = {
      email: 'john@jack.com',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '',
        keyword: 'required',
        message: 'should have required property \'password\'',
        params: {
          missingProperty: 'password',
        },
        schemaPath: '#/required',
      }
    ]);
  });

  it('should return an error if the email property is not a string.', () => {
    const credentials = {
      email: 1,
      password: 'myPassword',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '.email',
        keyword: 'type',
        message: 'should be string',
        params: {
          type: 'string',
        },
        schemaPath: '#/properties/email/type',
      }
    ]);
  });

  it('should return an error if the password property is not a string.', () => {
    const credentials = {
      email: 'john@jack.com',
      password: 1,
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '.password',
        keyword: 'type',
        message: 'should be string',
        params: {
          type: 'string',
        },
        schemaPath: '#/properties/password/type',
      }
    ]);
  });

  it('should return an error if the email property does not contain a valid email.', () => {
    const credentials = {
      email: 'johnjack.com',
      password: 'myPassword',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '.email',
        keyword: 'format',
        message: 'should match format "email"',
        params: {
          format: 'email',
        },
        schemaPath: '#/properties/email/format',
      }
    ]);
  });

  it('should return an error if there are additional properties.', () => {
    const credentials = {
      email: 'john@jack.com',
      foo: 'bar',
      password: 'myPassword',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, false);

    deepStrictEqual(ajv.errors, [
      {
        dataPath: '',
        keyword: 'additionalProperties',
        message: 'should NOT have additional properties',
        params: {
          additionalProperty: 'foo',
        },
        schemaPath: '#/additionalProperties',
      }
    ]);
  });

  it('should not return any error if the input is correct.', () => {
    const credentials = {
      email: 'john@jack.com',
      password: 'myPassword',
    };
    const isValid = ajv.validate(emailSchema, credentials);

    strictEqual(isValid, true);
  });
});

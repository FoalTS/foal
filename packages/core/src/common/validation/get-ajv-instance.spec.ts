import { deepStrictEqual, doesNotThrow, strictEqual } from 'assert';
import { Config, ConfigTypeError } from '../../core';
import { _instanceWrapper, getAjvInstance } from './get-ajv-instance';

function clearCache() {
  delete _instanceWrapper.instance;
}

describe('getAjvInstance', () => {

  it('should use defaults.', () => {
    const schema = {
      properties: {
        foo: { type: 'string', default: 'bar' }
      },
      type: 'object',
    };
    const data = {};
    getAjvInstance().validate(schema, data);
    strictEqual((data as any).foo, 'bar');
  });

  it('should remove additional properties.', () => {
    const schema = {
      additionalProperties: false,
      properties: {},
      type: 'object',
    };
    const data = { hello: 'world' };
    getAjvInstance().validate(schema, data);
    strictEqual(data.hasOwnProperty('hello'), false);
  });

  it('should coerce types.', () => {
    const schema = {
      properties: {
        foo: { type: 'number' }
      },
      type: 'object',
    };
    const data = {
      foo: '3'
    };
    getAjvInstance().validate(schema, data);
    strictEqual(data.foo, 3);
  });

  it('should support nullable values.', () => {
    const schema = {
      properties: {
        foo: { type: 'number' }
      },
      type: 'object',
    };
    const data = {
      foo: null
    };
    getAjvInstance().validate(schema, data);
    // Type coerced
    strictEqual(data.foo, 0);

    const schema2 = {
      properties: {
        foo: { type: 'number', nullable: true }
      },
      type: 'object',
    };
    const data2 = {
      foo: null
    };
    getAjvInstance().validate(schema2, data2);
    strictEqual(data2.foo, null);
  });

  it('should not support $data references.', () => {
    const schema6 = {
      properties: {
        password: {
          type: 'string',
        },
        confirmPassword: {
          const: {
            $data: '1/password',
          },
          type: 'string',
        },
      },
      type: 'object',
    };
    const data6 = {
      password: 'superSecretPassword',
      confirmPassword: 'superSecretPassword',
    };
    const ajv = getAjvInstance();
    strictEqual(ajv.validate(schema6, data6), false, 'By default, AJV should not be able to validate using $data references.');
    deepStrictEqual(ajv.errors, [
      {
        keyword: 'const',
        instancePath: '/confirmPassword',
        schemaPath: '#/properties/confirmPassword/const',
        params: {
          allowedValue: {
            $data: '1/password',
          },
        },
        message: 'must be equal to constant',
      }
    ], 'AJV should have error data explaining "confirmPassword" didn\'t match the expected value in "password"');
  });

  it('should support the custom keyword "components" (for Foal\'s OpenAPI validation).', () => {
    const schema = {
      components: {},
      properties: {},
      type: 'object',
    };
    const data = { hello: 'world' };

    doesNotThrow(() => getAjvInstance().validate(schema, data));
  });

  it('should support the custom OpenAPI keyword "example".', () => {
    const schema = {
      properties: {
        name: { type: 'string', example: 'My Organization Name' },
      },
      type: 'object',
    };
    const data = { hello: 'world' };

    doesNotThrow(() => getAjvInstance().validate(schema, data));
  });

  it('should support JSON schema formats for AJV (email, date, etc).', () => {
    const schema = {
      properties: {
        email: { type: 'string', format: 'email' }
      },
      type: 'object',
    };
    const data = { email: 'foo@foalts.org' };
    strictEqual(getAjvInstance().validate(schema, data), true);
  });

  describe('', () => {

    beforeEach(() => {
      clearCache();
      Config.set('settings.ajv.$data', true);
      Config.set('settings.ajv.allErrors', true);
      Config.set('settings.ajv.coerceTypes', false);
      Config.set('settings.ajv.removeAdditional', false);
      Config.set('settings.ajv.useDefaults', false);
    });

    it('should accept custom configuration from the Config.', () => {
      const schema = {
        additionalProperties: false,
        properties: {
          foo: { type: 'number', default: 4 }
        },
        type: 'object',
      };

      const ajv = getAjvInstance();

      // coerceTypes
      const data = {
        foo: '3'
      };
      strictEqual(ajv.validate(schema, data), false, 'Types should not be coerced.');

      // removeAdditional
      const data2 = {
        bar: 'hello',
        foo: 3,
      };
      strictEqual(ajv.validate(schema, data2), false, 'Additional properties should not be removed.');

      // useDefaults
      const data3 = {};
      ajv.validate(schema, data3);
      strictEqual((data3 as any).foo, undefined);

      // allErrors
      const schema5 = {
        properties: {
          a: { type: 'number' },
          b: { type: 'number' },
        },
        type: 'object',
      };
      const data5 = {
        a: 'c',
        b: 'd'
      };
      strictEqual(ajv.validate(schema5, data5), false);
      deepStrictEqual(ajv.errors, [
        {
          instancePath: '/a',
          keyword: 'type',
          message: 'must be number',
          params: { type: 'number' },
          schemaPath: '#/properties/a/type',
        },
        {
          instancePath: '/b',
          keyword: 'type',
          message: 'must be number',
          params: { type: 'number' },
          schemaPath: '#/properties/b/type',
        },
      ]);

      // $data
      const schema6 = {
        properties: {
          password: {
            type: 'string',
          },
          confirmPassword: {
            const: {
              $data: '1/password',
            },
            type: 'string',
          },
        },
        type: 'object',
      };
      const data6 = {
        password: 'superSecretPassword',
        confirmPassword: 'superSecretPassword',
      };
      strictEqual(ajv.validate(schema6, data6), true, 'If $data is true in the configuration, and property "confirmPassword" matches "password", AJV should validate the data as valid.');
      strictEqual(ajv.errors, null);

      const data7 = {
        password: 'superSecretPassword',
        confirmPassword: 'notEvenCloseToTheSamePassword',
      };
      strictEqual(ajv.validate(schema6, data7), false, 'If $data is true in the configuration, and property "confirmPassword" does not match "password", AJV should validate the data as invalid.');
      deepStrictEqual(ajv.errors, [
        {
          instancePath: '/confirmPassword',
          keyword: 'const',
          message: 'must be equal to constant',
          params: {
            allowedValue: 'superSecretPassword',
          },
          schemaPath: '#/properties/confirmPassword/const',
        }
      ], 'AJV should have errors explaining "confirmPassword" didn\'t match the expected value in "password"');
    });

    it('should throw a ConfigTypeError when the value of `settings.ajv.coerceTypes` has an invalid type.', () => {
      Config.set('settings.ajv.coerceTypes', false);
      getAjvInstance().validate({}, {});
      clearCache();

      Config.set('settings.ajv.coerceTypes', 'array');
      getAjvInstance().validate({}, {});
      clearCache();

      Config.set('settings.ajv.coerceTypes', 1);

      try {
        getAjvInstance().validate({}, {});
      } catch (error: any) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('A ConfigTypeError should have been thrown');
        }
        strictEqual(error.key, 'settings.ajv.coerceTypes');
        strictEqual(error.expected, 'boolean|string');
        strictEqual(error.actual, 'number');
        return;
      }

      throw new Error('An error should have been thrown');
    });

    it('should throw a ConfigTypeError when the value of `settings.ajv.allErrors` has an invalid type.', () => {
      Config.set('settings.ajv.allErrors', 'hello');

      try {
        getAjvInstance().validate({}, {});
      } catch (error: any) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('A ConfigTypeError should have been thrown');
        }
        strictEqual(error.key, 'settings.ajv.allErrors');
        strictEqual(error.expected, 'boolean');
        strictEqual(error.actual, 'string');
        return;
      }

      throw new Error('An error should have been thrown');
    });

    it('should throw a ConfigTypeError when the value of `settings.ajv.$data` has an invalid type.', () => {
      Config.set('settings.ajv.$data', 'hello');

      try {
        getAjvInstance().validate({}, {});
      } catch (error: any) {
        if (!(error instanceof ConfigTypeError)) {
          throw new Error('A ConfigTypeError should have been thrown');
        }
        strictEqual(error.key, 'settings.ajv.$data');
        strictEqual(error.expected, 'boolean');
        strictEqual(error.actual, 'string');
        return;
      }

      throw new Error('An error should have been thrown');
    });

    after(() => {
      clearCache();
      Config.remove('settings.ajv.$data');
      Config.remove('settings.ajv.allErrors');
      Config.remove('settings.ajv.coerceTypes');
      Config.remove('settings.ajv.removeAdditional');
      Config.remove('settings.ajv.useDefaults');
    });

  });

});

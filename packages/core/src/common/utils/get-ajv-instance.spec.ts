import { strictEqual } from 'assert';
import { _instanceWrapper, getAjvInstance } from './get-ajv-instance';

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

  describe('', () => {

    before(() => {
      delete _instanceWrapper.instance;
      process.env.SETTINGS_AJV_COERCE_TYPES = 'false';
      process.env.SETTINGS_AJV_REMOVE_ADDITIONAL = 'false';
      process.env.SETTINGS_AJV_USE_DEFAULTS = 'false';
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
    });

    after(() => {
      delete _instanceWrapper.instance;
      delete process.env.SETTINGS_AJV_COERCE_TYPES;
      delete process.env.SETTINGS_AJV_REMOVE_ADDITIONAL;
      delete process.env.SETTINGS_AJV_USE_DEFAULTS;
    });

  });

});

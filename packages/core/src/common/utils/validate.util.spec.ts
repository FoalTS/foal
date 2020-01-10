// std
import { deepStrictEqual, doesNotThrow, throws } from 'assert';

// FoalTS
import { ValidationError } from '../errors';
import { validate } from './validate.util';

describe('validate', () => {

  const schema = {
    properties: {
      a: { type: 'number' }
    },
    type: 'object',
  };

  it('should throw a ValidationError if the schema does not valid the object.', () => {
    const object = {
      a: 'foo'
    };

    throws(() => validate(schema, object), ValidationError);
    throws(() => validate(schema, object), (err: any) => {
      deepStrictEqual(err.content, [
        {
          dataPath: '.a',
          keyword: 'type',
          message: 'should be number',
          params: { type: 'number' },
          schemaPath: '#/properties/a/type',
        }
      ]);
      return true;
    });
  });

  it('should do nothing if the schema validate the object.', () => {
    const object = {
      a: 3
    };

    doesNotThrow(() => validate(schema, object));
  });

});

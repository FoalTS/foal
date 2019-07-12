// std
import { deepStrictEqual } from 'assert';

// FoalTS
import { extractProperties } from './extract-properties.util';

describe('extractProperties', () => {

  it('should extract the properties from a given schema.', () => {
    const schema = {
      properties: {
        barfoo: { type: 'number' },
        foobar: { type: 'string' },
      },
      required: [ 'barfoo' ]
    };
    deepStrictEqual(extractProperties(schema), [
      {
        name: 'barfoo',
        required: true,
        schema: { type: 'number' }
      },
      {
        name: 'foobar',
        required: false,
        schema: { type: 'string' }
      },
    ]);
  });

  it('should not fail if the schema does not have a "required" attribute.', () => {
    extractProperties({ properties: { foobar: { type: 'string' }}});
  });

  it('should not fail if the schema does not have a "properties" attribute.', () => {
    extractProperties({ required: [] });
  });

});

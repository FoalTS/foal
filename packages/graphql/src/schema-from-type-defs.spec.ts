import { deepStrictEqual } from 'assert';
import { graphql } from 'graphql';
import { schemaFromTypeDefs } from './schema-from-type-defs';

function parse(o: object): object {
  return JSON.parse(JSON.stringify(o));
}

describe('schemaFromTypeDefs', () => {

  it('should build a schema from one source.', async () => {
    const source = `
      type Query {
        hello: String
      }
    `;
    const root = {
      hello: () => {
        return 'Hello world!';
      },
    };

    const schema = schemaFromTypeDefs(source);

    const response = await graphql({
      schema,
      source: '{ hello }',
      rootValue: root,
    });
    deepStrictEqual(parse(response), {
      data: {
        hello: 'Hello world!'
      }
    });
  });

  it('should build a schema from several sources.', async () => {

    const source1 = `
      type Query {
        me: User
      }
    `;
    const source2 = `
      type User {
        id: ID
        name: String
      }
    `;
    const root = {
      me: () => {
        return { id: 'xxx', name: 'foobar' };
      },
    };

    const schema = schemaFromTypeDefs(source1, source2);

    const response = await graphql({
      schema,
      source: '{ me { name } }',
      rootValue: root,
    });
    deepStrictEqual(parse(response), {
      data: {
        me: { name: 'foobar' }
      }
    });

  });

});

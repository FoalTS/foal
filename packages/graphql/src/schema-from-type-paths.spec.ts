import { deepStrictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { graphql } from 'graphql';
import { schemaFromTypePaths } from './schema-from-type-paths';

function parse(o: object): object {
  return JSON.parse(JSON.stringify(o));
}

describe('schemaFromTypePaths', () => {

  beforeEach(() => mkdirSync('./test'));

  afterEach(() => {
    if (existsSync('./test/source.graphql')) {
      unlinkSync('./test/source.graphql');
    }
    if (existsSync('./test/source1.graphql')) {
      unlinkSync('./test/source1.graphql');
    }
    if (existsSync('./test/source2.graphql')) {
      unlinkSync('./test/source2.graphql');
    }
    rmdirSync('./test');
  });

  it('should build a schema from one path.', async () => {
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

    const path = './test/source.graphql';
    writeFileSync(path, source, 'utf8');

    const schema = await schemaFromTypePaths(path);

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

  it('should build a schema from several paths.', async () => {

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

    const path1 = './test/source1.graphql';
    writeFileSync(path1, source1, 'utf8');

    const path2 = './test/source2.graphql';
    writeFileSync(path2, source2, 'utf8');

    const schema = await schemaFromTypePaths(path1, path2);

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

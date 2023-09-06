import { deepStrictEqual, strictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { graphql } from 'graphql';
import { schemaFromTypeGlob } from './schema-from-type-glob';

function parse(o: object): object {
  return JSON.parse(JSON.stringify(o));
}

describe('schemaFromTypeGlob', () => {

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

  it('should throw an Error if the glob pattern does not match any files.', done => {
    schemaFromTypeGlob('./test/*.graphql')
      .then(data => new Error('An error should have been thrown.'))
      .catch(err => {
        try {
          strictEqual(err.message, 'No file found for the pattern "./test/*.graphql".');
        } catch (error: any) {
          done(error);
          return;
        }
        done();
      });
  });

  it('should build a schema from a glob pattern matching one file.', async () => {
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

    const schema = await schemaFromTypeGlob('./test/*.graphql');

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

  it('should build a schema from a glob pattern matching several files.', async () => {

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

    const schema = await schemaFromTypeGlob('./test/*.graphql');

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

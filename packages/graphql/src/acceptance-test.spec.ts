// This acceptance test is not located in the @foal/acceptance-test package because of a bug
// with lerna and peerDependencies. If we move the test to this package, we get the below error.
//
// Error: Cannot use GraphQLSchema "[object GraphQLSchema]" from another module or realm.
//
// Ensure that there is only one instance of "graphql" in the node_modules
// directory. If different versions of "graphql" are the dependencies of other
// relied on modules, use "resolutions" to ensure only one version is installed.
//
// https://yarnpkg.com/en/docs/selective-version-resolutions
//
// Duplicate "graphql" modules cannot be used at the same time since different
// versions may have different capabilities and behavior. The data from one
// version used in the function from another could produce confusing and
// spurious results.

// std
import { deepStrictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';

// 3p
import { controller, createApp, dependency } from '@foal/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { buildSchema } from 'graphql';
import { request } from 'graphql-request';
import gql from 'graphql-tag';

// FoalTS
import { get } from 'http';
import { GraphQLController } from './graphql.controller';
import { schemaFromTypeGlob } from './schema-from-type-glob';

const typeDefs = `type Query {
  user(id: Int): User
}

type User {
  id: Int
  name: String
}`;

describe('[Acceptance test] GraphQLController', () => {

  let server;

  afterEach(() => {
    if (existsSync('./test-dir/my-defs.graphql')) {
      unlinkSync('./test-dir/my-defs.graphql');
    }
    if (existsSync('./test-dir')) {
      rmdirSync('./test-dir');
    }
    if (server) {
      server.close();
    }
  });

  describe('should support common GraphQL clients such as', () => {
    class AppResolver {
      user(obj, args, context, info) {
        return {
          id: obj.id,
          name: 'someone!'
        };
      }
    }

    class ApiController extends GraphQLController {
      schema = buildSchema(typeDefs);

      @dependency
      resolvers: AppResolver;
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    beforeEach(() => server = createApp(AppController).listen(3000));

    it('graphql-request.', async () => {
      const data = await request(
        'http://localhost:3000/graphql',
        'query getUser($id: Int) { user(id: $id) { name, id } }', { id: 3 }
      );
      deepStrictEqual(data, {
        user: {
          id: 3,
          name: 'someone!'
        }
      });
    });

    it('apollo-client.', async () => {
      const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });
      const cache = new InMemoryCache();
      const client = new ApolloClient({ cache, link: httpLink });
      const { data } = await client.query({
        query: gql`query getUser($id: Int) { user(id: $id) { name, id } }`,
        variables: { id: 3 }
      });
      deepStrictEqual(data, {
        user: {
          __typename: 'User',
          id: 3,
          name: 'someone!'
        }
      });
    });
  });

  it('should work with type definitions located in separate files.', async () => {
    class AppResolver {
      user(obj, args, context, info) {
        return {
          id: obj.id,
          name: 'someone!'
        };
      }
    }

    class ApiController extends GraphQLController {
      schema = schemaFromTypeGlob('./test-dir/*.graphql');

      @dependency
      resolvers: AppResolver;
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    mkdirSync('./test-dir');
    writeFileSync('./test-dir/my-defs.graphql', typeDefs, 'utf8');

    server = createApp(AppController).listen(3000);

    const response = await new Promise((resolve, reject) => {
      get('http://localhost:3000/graphql?query={user{name}}', resp => {
        let data = '';
        resp.on('data', chunk => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', err => {
        reject(err);
      });
    });

    deepStrictEqual(response, {
      data: {
        user: { name: 'someone!' }
      }
    });
  });

});

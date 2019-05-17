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

// 3p
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { request } from 'graphql-request';
import gql from 'graphql-tag';

// FoalTS
import { controller, createApp, dependency } from '@foal/core';
import { deepStrictEqual, strictEqual } from 'assert';
import { buildSchema } from 'graphql';
import { GraphQLController } from './graphql.controller';

const typeDefs = `type Query {
  user(id: Int): User
}

type User {
  id: Int
  name: String
}`;

describe('GraphQLController (acceptance test)', () => {

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

  let server;

  beforeEach(() => server = createApp(AppController).listen(3000));

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  it('should support graphql-request as GraphQL client.', async () => {
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

  it('should support apollo-client as GraphQL client.', async () => {
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

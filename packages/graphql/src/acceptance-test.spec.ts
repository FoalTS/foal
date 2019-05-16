// Explain the peerDependencies bug with lerna

// Error: Cannot use GraphQLSchema "[object GraphQLSchema]" from another module or realm.

// Ensure that there is only one instance of "graphql" in the node_modules
// directory. If different versions of "graphql" are the dependencies of other
// relied on modules, use "resolutions" to ensure only one version is installed.

// https://yarnpkg.com/en/docs/selective-version-resolutions

// Duplicate "graphql" modules cannot be used at the same time since different
// versions may have different capabilities and behavior. The data from one
// version used in the function from another could produce confusing and
// spurious results.

// 3p
import * as request from 'supertest';

// FoalTS
import { controller, createApp, dependency } from '@foal/core';
import { buildSchema } from 'graphql';
import { GraphQLController } from './graphql.controller';

const typeDefs = `type Query {
  me: User
}

type User {
  id: ID
  name: String
}`;

it('FoalTS should allow developpers to use GraphQL.', async () => {

  class AppResolver {
    me() {
      return {
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

  const app = createApp(AppController);

  await request(app).post('/graphql')
    .send({ query: '{ me { name } }' })
    .expect(200)
    .expect({
      data: {
        me: {
          name: 'someone!'
        }
      }
    });

});

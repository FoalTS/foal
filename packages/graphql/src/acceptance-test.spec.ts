// This e2e test is not located in the e2e-tests package because of a bug
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
import { get, Server } from 'http';

// 3p
import { Config, controller, createApp, dependency } from '@foal/core';
import { buildSchema } from 'graphql';
import { request } from 'graphql-request';
import { buildSchema as buildTypeGraphQLSchema, Field, ObjectType, Query, Resolver } from 'type-graphql';

// FoalTS
import { FormatError } from './format-error.decorator';
import { GraphQLController } from './graphql.controller';
import { schemaFromTypeGlob } from './schema-from-type-glob';

const typeDefs = `type Query {
  user(id: Int): User
}

type User {
  id: Int
  name: String
}`;

describe('[E2E test] GraphQLController', () => {

  let server: Server;

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
    Config.remove('settings.debug');
  });

  describe('should support common GraphQL clients such as', () => {
    class AppResolver {
      user(args: any, context: any, info: any) {
        return {
          id: args.id,
          name: 'someone!'
        };
      }
    }

    class ApiController extends GraphQLController {
      schema = buildSchema(typeDefs);

      @dependency
      declare resolvers: AppResolver;
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    beforeEach(async () => server = (await createApp(AppController)).listen(3000));

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
  });

  it('should work with type definitions located in separate files.', async () => {
    class AppResolver {
      user(args: any, context: any, info: any) {
        return {
          id: args.id,
          name: 'someone!'
        };
      }
    }

    class ApiController extends GraphQLController {
      schema = schemaFromTypeGlob('./test-dir/*.graphql');

      @dependency
      declare resolvers: AppResolver;
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    mkdirSync('./test-dir');
    writeFileSync('./test-dir/my-defs.graphql', typeDefs, 'utf8');

    server = (await createApp(AppController)).listen(3000);

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

  it('should include in the documentation an example on how to handle errors in resolvers.', async () => {
    Config.set('settings.debug', false);

    class Resolvers {
      @FormatError()
      user() {
        throw new Error('This is an error');
      }
    }

    class ApiController extends GraphQLController {
      schema = buildSchema(typeDefs);

      @dependency
      declare resolvers: Resolvers;
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    server = (await createApp(AppController)).listen(3000);

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
        user: null
      },
      errors: [
        {
          locations: [
            {
              column: 2,
              line: 1
            }
          ],
          message: 'Internal Server Error',
          path: [
            'user'
          ]
        }
      ]
    });
  });

  it('should support TypeGraphQL.', async () => {
    @ObjectType()
    class Recipe {
      @Field()
      title: string;
    }

    @Resolver(Recipe)
    class RecipeResolver {

      @Query(returns => Recipe)
      async recipe() {
        return {
          title: 'foobar'
        };
      }

    }

    class ApiController extends GraphQLController {
      schema = buildTypeGraphQLSchema({
        resolvers: [ RecipeResolver ]
      });
    }

    class AppController {
      subControllers = [
        controller('/graphql', ApiController)
      ];
    }

    server = (await createApp(AppController)).listen(3000);

    const response = await new Promise((resolve, reject) => {
      get('http://localhost:3000/graphql?query={recipe{title}}', resp => {
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
        recipe: {
          title: 'foobar'
        }
      }
    });
  });

});

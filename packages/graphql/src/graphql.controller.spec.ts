// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseBadRequest,
  isHttpResponseOK
} from '@foal/core';
import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

// App
import { GraphQLController } from './graphql.controller';

describe('GraphQLController', () => {

  let controller: GraphQLController;
  class ConcreteController extends GraphQLController {
    schema = buildSchema('type Query { hello: String }');
  }

  beforeEach(() => controller = createController(ConcreteController));

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'get'), 'GET');
      strictEqual(getPath(ConcreteController, 'get'), '/');
    });

    describe('should validate the request query by returning an HttpResponseBadRequest instance', () => {

      it('if the "query" param is missing.', async () => {
        const ctx = new Context({
          query: {}
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The function should have returned an HttpResponseBadRequest instance.');
        }

        deepStrictEqual(response.body, [{
          instancePath: '',
          keyword: 'required',
          message: 'must have required property \'query\'',
          params: {
            missingProperty: 'query'
          },
          schemaPath: '#/required'
        }]);
      });

      it('if the "query" param is not a string.', async () => {
        const ctx = new Context({
          query: {
            query: {}
          }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The function should have returned an HttpResponseBadRequest instance.');
        }

        deepStrictEqual(response.body, [{
          instancePath: '/query',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string'
          },
          schemaPath: '#/properties/query/type'
        }]);
      });

      it('if the "operationName" param is not a string.', async () => {
        const ctx = new Context({
          query: {
            operationName: {},
            query: ''
          }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The function should have returned an HttpResponseBadRequest instance.');
        }

        deepStrictEqual(response.body, [{
          instancePath: '/operationName',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string'
          },
          schemaPath: '#/properties/operationName/type'
        }]);
      });

      it('if the "variables" param is not a string.', async () => {
        const ctx = new Context({
          query: {
            query: '',
            variables: {},
          }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The function should have returned an HttpResponseBadRequest instance.');
        }

        deepStrictEqual(response.body, [{
          instancePath: '/variables',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string'
          },
          schemaPath: '#/properties/variables/type'
        }]);
      });

      it('if the "variables" param is not a valid JSON-encoded string.', async () => {
        const ctx = new Context({
          query: {
            query: '',
            variables: '{',
          }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The function should have returned an HttpResponseBadRequest instance.');
        }

        strictEqual(
          response.body,
          `The "variables" URL parameter is not a valid JSON-encoded string: Expected property name or '}' in JSON at position 1 (line 1 column 2)`
        );
      });

    });

    describe('should return an HttpResponseOK instance', () => {
      class ConcreteController extends GraphQLController {
        schema = buildSchema(`type Query {
          hello: String
        }
        `);
      }

      beforeEach(() => controller = createController(ConcreteController));

      it('with an "errors" property if the GraphQL schema does not validate the query.', async () => {
        const query = `{ b }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          errors: [
            {
              locations: [
                { column: 3, line: 1 }
              ],
              message: 'Cannot query field "b" on type "Query".'
            }
          ]
        });
      });

      it('with a "data" property if the GraphQL schema validates the query.', async () => {
        const query = `{ hello }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: null
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query'
          + ' (schema given within a promise).', async () => {
        class ConcreteController extends GraphQLController {
          schema = Promise.resolve(buildSchema(`type Query {
            hello: String
          }
          `));
        }
        controller = createController(ConcreteController);

        const query = `{ hello }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: null
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query (with operationName).', async () => {
        class ConcreteController extends GraphQLController {
          schema = buildSchema(`type Query {
            hello: String
            hello2: String
          }
          `);
        }
        controller = createController(ConcreteController);

        const query = `query a { hello } \n query b { hello2 }`;
        const ctx = new Context({
          query: { query, operationName: 'b' }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello2: null
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query (with variables).', async () => {
        class ConcreteController extends GraphQLController {
          schema = new GraphQLSchema({
            query: new GraphQLObjectType({
              fields: {
                hello: {
                  args: {
                    input: {
                      type: GraphQLString,
                    },
                  },
                  type: GraphQLString,
                  resolve(obj: any, args: any, context: any, info: any) {
                    return JSON.stringify(args);
                  }
                }
              },
              name: 'RootQueryType',
            })
          });
        }
        controller = createController(ConcreteController);

        const query = `query a($input: String) { hello(input: $input) }`;
        const ctx = new Context({
          query: { query, variables: '{"input":"foobar"}' }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: '{"input":"foobar"}'
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query (with default context).', async () => {
        class ConcreteController extends GraphQLController {
          schema = new GraphQLSchema({
            query: new GraphQLObjectType({
              fields: {
                hello: {
                  type: GraphQLString,
                  resolve(obj: any, args: any, context: any, info: any) {
                    return context.request.foo;
                  }
                }
              },
              name: 'RootQueryType',
            })
          });
        }
        controller = createController(ConcreteController);

        const query = `{ hello }`;
        const ctx = new Context({
          foo: 'bar',
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: 'bar'
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query (with custom context).', async () => {
        class ConcreteController extends GraphQLController {
          schema = new GraphQLSchema({
            query: new GraphQLObjectType({
              fields: {
                hello: {
                  type: GraphQLString,
                  resolve(obj: any, args: any, context: any, info: any) {
                    return context.foo;
                  }
                }
              },
              name: 'RootQueryType',
            })
          });

          getResolverContext(ctx: Context) {
            return { foo: 'bar' };
          }
        }
        controller = createController(ConcreteController);

        const query = `{ hello }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: 'bar'
          }
        });
      });

      it('with a "data" property if the GraphQL schema validates the query (with resolvers).', async () => {
        class ConcreteController extends GraphQLController {
          schema = buildSchema(`type Query {
            hello: String
          }
          `);
          resolvers = {
            hello: () => {
              return 'Hello world!';
            },
          };
        }
        controller = createController(ConcreteController);

        const query = `{ hello }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(response.body, {
          data: {
            hello: 'Hello world!'
          }
        });
      });

    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'post'), 'POST');
      strictEqual(getPath(ConcreteController, 'post'), '/');
    });

    describe('given ctx.request.query.query is defined', () => {

      describe('should validate the request query by returning an HttpResponseBadRequest instance', () => {

        it('if the "query" param is not a string.', async () => {
          const ctx = new Context({
            query: {
              query: {}
            }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/query',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/properties/query/type'
          }]);
        });

        it('if the "operationName" param is not a string.', async () => {
          const ctx = new Context({
            query: {
              operationName: {},
              query: ''
            }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/operationName',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/properties/operationName/type'
          }]);
        });

        it('if the "variables" param is not a string.', async () => {
          const ctx = new Context({
            query: {
              query: '',
              variables: {},
            }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/variables',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/properties/variables/type'
          }]);
        });

        it('if the "variables" param is not a valid JSON-encoded string.', async () => {
          const ctx = new Context({
            query: {
              query: '',
              variables: '{',
            }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          strictEqual(
            response.body,
            `The "variables" URL parameter is not a valid JSON-encoded string: Expected property name or '}' in JSON at position 1 (line 1 column 2)`
          );
        });

      });

      describe('should return an HttpResponseOK instance', () => {
        class ConcreteController extends GraphQLController {
          schema = buildSchema(`type Query {
            hello: String
          }
          `);
        }

        beforeEach(() => controller = createController(ConcreteController));

        it('with an "errors" property if the GraphQL schema does not validate the query.', async () => {
          const query = `{ b }`;
          const ctx = new Context({
            query: { query }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            errors: [
              {
                locations: [
                  { column: 3, line: 1 }
                ],
                message: 'Cannot query field "b" on type "Query".'
              }
            ]
          });
        });

        it('with a "data" property if the GraphQL schema validates the query'
            + ' (schema given within a promise).', async () => {
          class ConcreteController extends GraphQLController {
            schema = Promise.resolve(buildSchema(`type Query {
              hello: String
            }
            `));
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            query: { query }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the query (with operationName).', async () => {
          class ConcreteController extends GraphQLController {
            schema = buildSchema(`type Query {
              hello: String
              hello2: String
            }
            `);
          }
          controller = createController(ConcreteController);

          const query = `query a { hello } \n query b { hello2 }`;
          const ctx = new Context({
            query: { query, operationName: 'b' }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello2: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the query (with variables).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    args: {
                      input: {
                        type: GraphQLString,
                      },
                    },
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return JSON.stringify(args);
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });
          }
          controller = createController(ConcreteController);

          const query = `query a($input: String) { hello(input: $input) }`;
          const ctx = new Context({
            query: { query, variables: '{"input":"foobar"}' }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: '{"input":"foobar"}'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the query (with default context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.request.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            foo: 'bar',
            query: { query }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the query (with custom context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });

            getResolverContext(ctx: Context) {
              return { foo: 'bar' };
            }
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            query: { query }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the query (with resolvers).', async () => {
          class ConcreteController extends GraphQLController {
            schema = buildSchema(`type Query {
              hello: String
            }
            `);
            resolvers = {
              hello: () => {
                return 'Hello world!';
              },
            };
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            query: { query }
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'Hello world!'
            }
          });
        });

      });

    });

    describe('given ctx.request.query.query is undefined and Content-Type !== "application/graphql"', () => {

      describe('should validate the request body by returning an HttpResponseBadRequest instance', () => {

        it('if the "query" property is missing.', async () => {
          const ctx = new Context({
            body: {},
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'query\'',
            params: {
              missingProperty: 'query'
            },
            schemaPath: '#/required'
          }]);
        });

        it('if the "query" property is not a string.', async () => {
          const ctx = new Context({
            body: {
              query: {}
            },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/query',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/properties/query/type'
          }]);
        });

        it('if the "operationName" property is not a string.', async () => {
          const ctx = new Context({
            body: {
              operationName: {},
              query: ''
            },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/operationName',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/properties/operationName/type'
          }]);
        });

        it('if the "variables" property is not an object.', async () => {
          const ctx = new Context({
            body: {
              query: '',
              variables: '',
            },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '/variables',
            keyword: 'type',
            message: 'must be object,null',
            params: {
              type: ['object', 'null']
            },
            schemaPath: '#/properties/variables/type'
          }]);
        });

      });

      describe('should return an HttpResponseOK instance', () => {
        class ConcreteController extends GraphQLController {
          schema = buildSchema(`type Query {
            hello: String
          }
          `);
        }

        beforeEach(() => controller = createController(ConcreteController));

        it('with an "errors" property if the GraphQL schema does not validate the body.', async () => {
          const query = `{ b }`;
          const ctx = new Context({
            body: { query },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            errors: [
              {
                locations: [
                  { column: 3, line: 1 }
                ],
                message: 'Cannot query field "b" on type "Query".'
              }
            ]
          });
        });

        it('with a "data" property if the GraphQL schema validates the body.', async () => {
          const query = `{ hello }`;
          const ctx = new Context({
            body: { query },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with variables === null).', async () => {
          const query = `{ hello }`;
          const ctx = new Context({
            body: { query, variables: null },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body'
            + ' (schema given within a promise).', async () => {
          class ConcreteController extends GraphQLController {
            schema = Promise.resolve(buildSchema(`type Query {
              hello: String
            }
            `));
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: { query },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with operationName).', async () => {
          class ConcreteController extends GraphQLController {
            schema = buildSchema(`type Query {
              hello: String
              hello2: String
            }
            `);
          }
          controller = createController(ConcreteController);

          const query = `query a { hello } \n query b { hello2 }`;
          const ctx = new Context({
            body: { query, operationName: 'b' },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello2: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with variables).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    args: {
                      input: {
                        type: GraphQLString,
                      },
                    },
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return JSON.stringify(args);
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });
          }
          controller = createController(ConcreteController);

          const query = `query a($input: String) { hello(input: $input) }`;
          const ctx = new Context({
            body: { query, variables: { input: 'foobar' } },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: '{"input":"foobar"}'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with default context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.request.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: { query },
            foo: 'bar',
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with custom context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });

            getResolverContext(ctx: Context) {
              return { foo: 'bar' };
            }
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: { query },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with resolvers).', async () => {
          class ConcreteController extends GraphQLController {
            schema = buildSchema(`type Query {
              hello: String
            }
            `);
            resolvers = {
              hello: () => {
                return 'Hello world!';
              },
            };
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: { query },
            get: () => 'application/json',
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'Hello world!'
            }
          });
        });

      });

    });

    describe('given ctx.request.query.query is undefined and Content-Type === "application/graphql"', () => {

      describe('should validate the request body by returning an HttpResponseBadRequest instance', () => {

        it('if the body is not a string.', async () => {
          const ctx = new Context({
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            body: undefined,
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseBadRequest(response)) {
            throw new Error('The function should have returned an HttpResponseBadRequest instance.');
          }

          deepStrictEqual(response.body, [{
            instancePath: '',
            keyword: 'type',
            message: 'must be string',
            params: {
              type: 'string'
            },
            schemaPath: '#/type'
          }]);
        });

      });

      describe('should return an HttpResponseOK instance', () => {
        class ConcreteController extends GraphQLController {
          schema = buildSchema(`type Query {
              hello: String
            }
            `);
        }

        beforeEach(() => controller = createController(ConcreteController));

        it('with an "errors" property if the GraphQL schema does not validate the body.', async () => {
          const query = `{ b }`;
          const ctx = new Context({
            body: query,
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            errors: [
              {
                locations: [
                  { column: 3, line: 1 }
                ],
                message: 'Cannot query field "b" on type "Query".'
              }
            ]
          });
        });

        it('with a "data" property if the GraphQL schema validates the body.', async () => {
          const query = `{ hello }`;
          const ctx = new Context({
            body: query,
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body'
            + ' (schema given within a promise).', async () => {
          class ConcreteController extends GraphQLController {
            schema = Promise.resolve(buildSchema(`type Query {
                hello: String
              }
              `));
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: query,
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: null
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with default context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.request.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: query,
            foo: 'bar',
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with custom context).', async () => {
          class ConcreteController extends GraphQLController {
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                fields: {
                  hello: {
                    type: GraphQLString,
                    resolve(obj: any, args: any, context: any, info: any) {
                      return context.foo;
                    }
                  }
                },
                name: 'RootQueryType',
              })
            });

            getResolverContext(ctx: Context) {
              return { foo: 'bar' };
            }
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: query,
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'bar'
            }
          });
        });

        it('with a "data" property if the GraphQL schema validates the body (with resolvers).', async () => {
          class ConcreteController extends GraphQLController {
            schema = buildSchema(`type Query {
                hello: String
              }
              `);
            resolvers = {
              hello: () => {
                return 'Hello world!';
              },
            };
          }
          controller = createController(ConcreteController);

          const query = `{ hello }`;
          const ctx = new Context({
            body: query,
            get(headerName: string) {
              return headerName === 'Content-Type' ? 'application/graphql' : 'foo';
            },
            query: {}
          });
          const response = await controller.post(ctx);

          if (!isHttpResponseOK(response)) {
            throw new Error('The controller should have returned an HttpResponseOK instance.');
          }

          deepStrictEqual(response.body, {
            data: {
              hello: 'Hello world!'
            }
          });
        });

      });

    });

  });

});

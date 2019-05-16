// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath, isHttpResponseBadRequest,
  isHttpResponseOK
} from '@foal/core';
import { buildSchema } from 'graphql';

// App
import { GraphQLController } from './graphql.controller';

describe('GraphQLController', () => {

  let controller: GraphQLController;
  class ConcreteController extends GraphQLController {
    schema = {};
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
          dataPath: '',
          keyword: 'required',
          message: 'should have required property \'query\'',
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
          dataPath: '.query',
          keyword: 'type',
          message: 'should be string',
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
          dataPath: '.operationName',
          keyword: 'type',
          message: 'should be string',
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
          dataPath: '.variables',
          keyword: 'type',
          message: 'should be string',
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
          'The "variables" URL parameter is not a valid JSON-encoded string: Unexpected end of JSON input'
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

        deepStrictEqual(JSON.parse(response.body), {
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

      it('with a "data" property if the GraphQL schema validates the query (without resolvers).', async () => {
        const query = `{ hello }`;
        const ctx = new Context({
          query: { query }
        });
        const response = await controller.get(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The controller should have returned an HttpResponseOK instance.');
        }

        deepStrictEqual(JSON.parse(response.body), {
          data: {
            hello: null
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

        deepStrictEqual(JSON.parse(response.body), {
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

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.post(ctx)));
    });

  });

});

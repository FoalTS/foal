// 3p
import { Context, Get, HttpResponse, HttpResponseBadRequest, HttpResponseOK, Post, } from '@foal/core';
import Ajv from 'ajv';
import { graphql, GraphQLSchema } from 'graphql';

const getQuerySchema = {
  properties: {
    operationName: { type: 'string' },
    query: { type: 'string' },
    variables: { type: 'string' },
  },
  required: ['query'],
  type: 'object',
};

const postBodySchema = {
  properties: {
    operationName: { type: 'string', nullable: true },
    query: { type: 'string' },
    variables: { type: ['object', 'null'] },
  },
  required: ['query'],
  type: 'object',
};

function sanitize(o: object): object {
  return JSON.parse(JSON.stringify(o));
}

const ajv = new Ajv();

/**
 * GraphQL controller compatible compatible with the common GraphQL clients
 * ([graphql-request](https://www.npmjs.com/package/graphql-request), etc) or any client that
 * follows the HTTP specification defined [here](https://graphql.org/learn/serving-over-http/).
 *
 * @export
 * @abstract
 * @class GraphQLController
 */
export abstract class GraphQLController {
  abstract schema: GraphQLSchema|Promise<GraphQLSchema>;
  resolvers: object;

  getResolverContext(ctx: Context): object {
    return ctx;
  }

  @Get('/')
  async get(ctx: Context) {
    if (!ajv.validate(getQuerySchema, ctx.request.query)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    let variables: Record<string, unknown> | undefined;
    if (ctx.request.query.variables) {
      try {
        variables = JSON.parse(ctx.request.query.variables);
      } catch (error: any) {
        return new HttpResponseBadRequest(
          `The "variables" URL parameter is not a valid JSON-encoded string: ${error.message}`
        );
      }
    }

    const result = await graphql({
      contextValue: this.getResolverContext(ctx),
      operationName: ctx.request.query.operationName,
      rootValue: this.resolvers,
      schema: await this.schema,
      source: ctx.request.query.query,
      variableValues: variables,
    });
    return new HttpResponseOK(sanitize(result));
  }

  @Post('/')
  async post(ctx: Context) {
    if (ctx.request.query.query !== undefined) {
      return this.get(ctx);
    }

    if (ctx.request.get('Content-Type') === 'application/graphql') {
      return this.postApplicationGraphQL(ctx);
    }

    if (!ajv.validate(postBodySchema, ctx.request.body)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    const result = await graphql({
      contextValue: this.getResolverContext(ctx),
      operationName: ctx.request.body.operationName,
      rootValue: this.resolvers,
      schema: await this.schema,
      source: ctx.request.body.query,
      variableValues: ctx.request.body.variables,
    });

    return new HttpResponseOK(sanitize(result));
  }

  private async postApplicationGraphQL(ctx: Context): Promise<HttpResponse> {
    if (!ajv.validate({ type: 'string' }, ctx.request.body)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    const result = await graphql({
      contextValue: this.getResolverContext(ctx),
      rootValue: this.resolvers,
      schema: await this.schema,
      source: ctx.request.body
    });

    return new HttpResponseOK(sanitize(result));
  }

}

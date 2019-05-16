import { Context, Get, getAjvInstance, HttpResponseBadRequest, HttpResponseOK, Post, } from '@foal/core';
import { graphql } from 'graphql';

const getSchema = {
  properties: {
    operationName: { type: 'string' },
    query: { type: 'string' },
    variables: { type: 'string' },
  },
  required: [ 'query' ],
  type: 'object',
};

export abstract class GraphQLController {
  abstract schema: object;
  resolvers: object;

  getResolverContext(ctx: Context): object {
    return ctx;
  }

  @Get('/')
  async get(ctx: Context) {
    const ajv = getAjvInstance();

    if (!ajv.validate(getSchema, ctx.request.query)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    if (ctx.request.query.variables) {
      try {
        JSON.parse(ctx.request.query.variables);
      } catch (error) {
        return new HttpResponseBadRequest(
          `The "variables" URL parameter is not a valid JSON-encoded string: ${error.message}`
        );
      }
    }

    const result = await graphql(this.schema, ctx.request.query.query, this.resolvers);
    return new HttpResponseOK(JSON.stringify(result));
  }

  @Post('/')
  post(ctx: Context) {
    return new HttpResponseOK();
  }
}

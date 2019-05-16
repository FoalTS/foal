import { Context, Get, getAjvInstance, HttpResponseBadRequest, HttpResponseOK, Post, } from '@foal/core';
import { graphql } from 'graphql';

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
    operationName: { type: 'string' },
    query: { type: 'string' },
    variables: { type: 'object' },
  },
  required: ['query'],
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

    if (!ajv.validate(getQuerySchema, ctx.request.query)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    let variables: object | undefined;
    if (ctx.request.query.variables) {
      try {
        variables = JSON.parse(ctx.request.query.variables);
      } catch (error) {
        return new HttpResponseBadRequest(
          `The "variables" URL parameter is not a valid JSON-encoded string: ${error.message}`
        );
      }
    }

    const result = await graphql({
      operationName: ctx.request.query.operationName,
      rootValue: this.resolvers,
      schema: this.schema,
      source: ctx.request.query.query,
      variableValues: variables,
    });
    return new HttpResponseOK(result);
  }

  @Post('/')
  async post(ctx: Context) {
    const ajv = getAjvInstance();

    if (ctx.request.query.query !== undefined) {
      return this.get(ctx);
    }

    if (ctx.request.get('Content-Type') === 'application/graphql') {
      if (!ajv.validate({ type: 'string' }, ctx.request.body)) {
        return new HttpResponseBadRequest(ajv.errors);
      }

      const result = await graphql({
        rootValue: this.resolvers,
        schema: this.schema,
        source: ctx.request.body
      });

      return new HttpResponseOK(result);
    }

    if (!ajv.validate(postBodySchema, ctx.request.body)) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    const result = await graphql({
      operationName: ctx.request.body.operationName,
      rootValue: this.resolvers,
      schema: this.schema,
      source: ctx.request.body.query,
      variableValues: ctx.request.body.variables,
    });

    return new HttpResponseOK(result);
  }
}

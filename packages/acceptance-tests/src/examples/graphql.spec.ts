// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import * as request from 'supertest';

// FoalTS
import { Context, createApp, dependency, Get, HttpResponseOK, Post } from '@foal/core';
import { buildSchema, graphql } from 'graphql';

const expectedSchema = `type Query {
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

  class AppController {
    @dependency
    rootResolver: AppResolver;

    // OR
    // rootResolver = new MyTypeORMResolver

    @Get('/graphql')
    async getSchema() {
      return new HttpResponseOK(await this.readSchema());
    }

    @Post('/graphql')
    async makeRequest(ctx: Context) {
      const schema = buildSchema(await this.readSchema());

      const graphqlResponse = await graphql(schema, ctx.request.body.query, this.rootResolver);
      return new HttpResponseOK(graphqlResponse);
    }

    private readSchema(): Promise<string> {
      return promisify(readFile)(join(__dirname, 'schema.graphql'), 'utf8');
    }
  }

  const app = createApp(AppController);

  await request(app).get('/graphql')
    .expect(200)
    .expect(expectedSchema);

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

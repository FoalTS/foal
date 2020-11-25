// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(async () => {
    await createConnection();
    app = await createApp(AppController);
  });

  after(() => getConnection().close());

  it('should return the proper OpenAPI spec on GET /swagger/openapi.json requests.', () => {
    return request(app)
      .get('/swagger/openapi.json')
      .expect(200)
      .expect({
        info: {
          title: 'A Great API',
          version: '1.0.0'
        },
        openapi: '3.0.0',
        paths: {
          '/': {
            get: {
              responses: {
                400: {
                  description: 'Bad request.'
                }
              },
              parameters: [
                {
                  in: 'cookie',
                  name: 'foobar',
                  schema: {
                    type: 'string'
                  },
                  required: true
                }
              ]
            }
          }
        }
      });
  });

});

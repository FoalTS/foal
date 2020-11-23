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
    app = createApp(AppController, {
      methods: {
        handleError: true
      }
    });
  });

  after(() => getConnection().close());

  it('should return a 403 status on GET /products requests.', () => {
    return request(app)
      .get('/products')
      .expect(403)
      .expect('Access forbidden');
  });

});

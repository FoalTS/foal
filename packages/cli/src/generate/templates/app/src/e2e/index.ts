// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

// App
import { AppModule } from '../app/app.module';

describe('The server', () => {

  let app;

  before(async () => {
    await createConnection();
    app = createApp(AppModule);
  });

  after(() => getConnection().close());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

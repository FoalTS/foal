// 3p
import { createApp } from '@foal/core';
import { connect, disconnect } from 'mongoose';
import * as request from 'supertest';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(async () => {
    await connect('mongodb://localhost:27017/e2e_db', { useNewUrlParser: true });
    app = createApp(AppController);
  });

  after(() => disconnect());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

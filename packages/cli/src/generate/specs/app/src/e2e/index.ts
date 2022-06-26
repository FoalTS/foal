// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;
  let connection: Connection;

  before(async () => {
    app = await createApp(AppController);
    connection = await createConnection();
  });

  after(async () => {
    if (connection) {
      await connection.close();
    }
  });

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

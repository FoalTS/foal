// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { createDataSource } from '../db';

describe('The server', () => {

  let app;
  let dataSource: DataSource;

  before(async () => {
    app = await createApp(AppController);
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

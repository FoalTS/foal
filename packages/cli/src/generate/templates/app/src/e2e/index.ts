// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { createDataSource } from '../data-source';

describe('The server', () => {

  let app;
  let dataSource: DataSource;

  before(async () => {
    dataSource = createDataSource();
    await dataSource.initialize();

    app = await createApp(AppController);
  });

  after(() => dataSource.destroy());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

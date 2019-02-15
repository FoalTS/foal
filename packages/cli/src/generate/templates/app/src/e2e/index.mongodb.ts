// 3p
import { Config, createApp } from '@foal/core';
import { connect, disconnect } from 'mongoose';
import * as request from 'supertest';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(() => {
    const uri = Config.get<string>('mongodb.uri');
    connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    app = createApp(AppController);
  });

  after(() => disconnect());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

// 3p
import { createAndInitApp, createApp, ServiceManager } from '@foal/core';
import * as request from 'supertest';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(async () => {
    const serviceManager = new ServiceManager();
    app = await createAndInitApp(AppController, { serviceManager });
    await serviceManager.boot();
  });

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('!hello world');
  });

});

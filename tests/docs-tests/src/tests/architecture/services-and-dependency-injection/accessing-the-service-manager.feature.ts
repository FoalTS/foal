// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, dependency, Get, HttpResponseOK, ServiceManager } from '@foal/core';

describe('Feature: Accessing the ServiceManager', () => {

  it('Example: Returning "Hello world!"', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyService {
      foo() {
        return 'foo';
      }
    }

    class MyController {
      @dependency
      services: ServiceManager;

      @Get('/bar')
      bar() {
        const msg = this.services.get(MyService).foo();
        return new HttpResponseOK(msg);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/bar')
      .expect(200)
      .expect('foo');
  });

});

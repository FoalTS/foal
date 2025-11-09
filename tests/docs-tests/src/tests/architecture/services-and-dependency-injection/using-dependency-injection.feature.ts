// std
import { strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, dependency, Get, HttpResponseOK } from '@foal/core';

describe('Feature: Using dependency injection', () => {

  it('Example: Accessing a service from a controller', async () => {

    let msg = 'not called';

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class Logger {
      log(message: string) {
        msg = `${new Date()} - ${message}`;
      }
    }

    class AppController {
      @dependency
      logger: Logger;

      @Get('/')
      index() {
        this.logger.log('index has been called!');
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');

    strictEqual(msg.endsWith(' - index has been called!'), true);
  });

  it('Example: Accessing a service from another service', async () => {

    let msg = 'not called';

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyService {
      run() {
        msg = 'hello world';
      }
    }

    class MyServiceA {
      @dependency
      myService: MyService;

      foo() {
        this.myService.run();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      @dependency
      serviceA: MyServiceA;

      @Get('/')
      index() {
        this.serviceA.foo();
        return new HttpResponseOK('Hello world!');
      }

    }

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');

    strictEqual(msg, 'hello world');
  });

});

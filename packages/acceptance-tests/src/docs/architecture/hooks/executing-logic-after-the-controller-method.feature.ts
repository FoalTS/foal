// 3p
import * as request from 'supertest';

// FoalTS
import { Config, createApp, Get, Hook, HttpResponseOK } from '@foal/core';

describe('Feature: Executing logic after the controller method.', () => {

  beforeEach(() => Config.set('settings.logErrors', false));

  afterEach(() => Config.remove('settings.logErrors'));

  it('Example: Adding a CSRF cookie', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {

      @Get('/')
      @Hook(() => response => {
        response.setCookie('X-CSRF-TOKEN', 'xxx');
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Set-Cookie', 'X-CSRF-TOKEN=xxx; Path=/')
      .expect('Hello world!');
  });

  it('Example: Computing the execution time', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {

      @Get('/')
      @Hook(() => {
        const time = process.hrtime();

        return () => {
          const seconds = process.hrtime(time)[0];
          // console.log(`Executed in ${seconds} seconds`);
        };
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

});

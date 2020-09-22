// 3p
import * as request from 'supertest';

// FoalTS
import { Config, createApp, Get, HttpResponseOK, Post } from '@foal/core';

describe('Feature: Inheriting controllers', () => {

  beforeEach(() => Config.set('settings.logErrors', false));

  afterEach(() => Config.remove('settings.logErrors'));

  it('Example: A simple inheritance', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    abstract class ParentController {
      @Get('/foo')
      foo() {
        return new HttpResponseOK();
      }
    }

    class ChildController extends ParentController {
      @Post('/bar')
      bar() {
        return new HttpResponseOK();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(ChildController);

    await request(app)
      .get('/foo')
      .expect(200);

    await request(app)
      .post('/bar')
      .expect(200);
  });

});

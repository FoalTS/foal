// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseOK, MergeHooks,  ValidateCookie, ValidateHeader} from '@foal/core';

describe('Feature: Grouping several hooks into one.', () => {

  it('Example: Creating a validation hook.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // Before

    // tslint:disable-next-line
    class MyController {
      @Get('/products')
      @ValidateHeader('Authorization')
      @ValidateCookie('foo')
      readProducts() {
        return new HttpResponseOK();
      }
    }

    // After

    function ValidateAll() {
      return MergeHooks(
        ValidateHeader('Authorization'),
        ValidateCookie('foo')
      );
    }

    class MyController2 {
      @Get('/products')
      @ValidateAll()
      readProducts() {
        return new HttpResponseOK();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController2);

    await request(app)
      .get('/products')
      .set('Authorization', 'hello')
      .expect(400);

    await request(app)
      .get('/products')
      .set('Cookie', ['foo=bar'])
      .expect(400);

    await request(app)
      .get('/products')
      .set('Authorization', 'hello')
      .set('Cookie', ['foo=bar'])
      .expect(200);
  });

});

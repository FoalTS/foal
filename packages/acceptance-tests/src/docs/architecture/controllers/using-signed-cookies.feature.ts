// std
import { strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { Context, HttpResponseOK, Get, createApp, controller, Config } from '@foal/core';
import { readCookie, writeCookie } from '../../../common';

describe('Feature: Signing cookies', () => {

  beforeEach(() => Config.set('settings.cookieParser.secret', 'strong-secret'));

  afterEach(() => Config.remove('settings.cookieParser.secret'));

  it('Example: A simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class Controller1 {
      @Get('/')
      index(ctx: Context) {
        const cookie1: string|undefined = ctx.request.signedCookies.cookie1;
        // Do something.
        return new HttpResponseOK({ cookie1 });
      }
    }

    class Controller2 {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setCookie('cookie1', 'value1', {
            signed: true
          });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        controller('/read-cookie', Controller1),
        controller('/set-cookie', Controller2),
      ]
    }

    const app = await createApp(AppController);

    let cookie1 = '';

    await request(app)
      .get('/set-cookie')
      .expect(200)
      .then(response => {
        cookie1 = readCookie(response.get('Set-Cookie') || [], 'cookie1').value;
      });

    // Check that the value is signed (see cookie-parser spec.)
    strictEqual(decodeURIComponent(cookie1).startsWith('s:'), true);

    await request(app)
      .get('/read-cookie')
      .set('Cookie', writeCookie('cookie1', cookie1))
      .expect(200)
      .expect({
        cookie1: 'value1'
      });
  });

});

// std
import { strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseOK } from '@foal/core';

describe('Feature: Returning a response', () => {

  it('Example: Adding Headers', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setHeader('Cache-Control', 'max-age=604800, public');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Cache-Control', 'max-age=604800, public');
  });

  it('Example: Adding Cookies (no cookie directives)', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setCookie('state', 'foobar');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('set-cookie', 'state=foobar; Path=/');
  });

  it('Example: Adding Cookies (with cookie directives)', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setCookie('sessionID', 'xxxx', {
            domain: 'example.com',
            httpOnly: true,
            // expires: new Date(2022, 12, 12),
            maxAge: 3600,
            path: '/',
            sameSite: 'lax',
            secure: true,
          });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .then(response => {
        strictEqual(response.get('Set-Cookie')?.[0].startsWith('sessionID=xxxx; Max-Age=3600; Domain=example.com; Path=/; '), true);
        strictEqual(response.get('Set-Cookie')?.[0].endsWith('; HttpOnly; Secure; SameSite=Lax'), true);
      });
  });

});

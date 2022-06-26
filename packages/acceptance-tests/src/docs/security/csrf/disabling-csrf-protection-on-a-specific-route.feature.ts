// std
import { } from 'assert';

// 3p
import * as request from 'supertest';
import { Connection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import { Config, controller, createApp, Get, HttpResponseOK, Post, UseSessions } from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createTestConnection, getTypeORMStorePath, readCookie, writeCookie } from '../../../common';

describe('Feature: Disabling CSRF protection on a specific route.', () => {

  let connection: Connection;

  beforeEach(() => {
    Config.set('settings.session.csrf.enabled', true);
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.csrf.enabled');
    Config.remove('settings.session.store');
    if (connection) {
      await connection.close();
    }
  });

  it('Example: use case with @UseSessions.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {
      @Post('/foo')
      @UseSessions({ cookie: true })
      foo() {
        // This method has the CSRF protection enabled.
        return new HttpResponseOK();
      }

      @Post('/bar')
      @UseSessions({ cookie: true, csrf: false })
      bar() {
        // This method does not have the CSRF protection enabled.
        return new HttpResponseOK();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        controller('/api', ApiController)
      ];

      @Get('/')
      @UseSessions({ cookie: true })
      index() {
        return new HttpResponseOK();
      }

    }

    const app = await createApp(AppController);
    connection = await createTestConnection([ DatabaseSession ]);

    let token = '';

    // Create the session and get its ID.
    await request(app)
      .get('/')
      .then(response => {
        const { value } = readCookie(response.get('Set-Cookie'), 'sessionID');
        token = value;
      });

    // Send a request on CSRF-protected route without the CSRF token.
    await request(app)
      .post('/api/foo')
      .set('Cookie', writeCookie('sessionID', token))
      .send()
      .expect(403);

    // Send a request on CSRF-unprotected route without the CSRF token.
    await request(app)
      .post('/api/bar')
      .set('Cookie', writeCookie('sessionID', token))
      .send()
      .expect(200);

  });

});

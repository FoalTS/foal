// std
import { strictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { Connection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config, createApp, Get, HttpResponseOK, UseSessions,
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';

describe('Feature: Overriding the cookie options', async () => {

  let connection: Connection;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    Config.remove('settings.session.cookie.name');
    Config.remove('settings.session.cookie.domain');
    Config.remove('settings.session.cookie.httpOnly');
    Config.remove('settings.session.cookie.path');
    Config.remove('settings.session.cookie.sameSite');
    Config.remove('settings.session.cookie.secure');
    if (connection) {
      await connection.close();
    }
  });

  it('Example: Override all options.', async () => {
    @UseSessions({ cookie: true })
    class AppController {

      @Get('/')
      index() {
        return new HttpResponseOK();
      }

    }

    const app = await createApp(AppController);
    connection = await createAndInitializeDataSource([ DatabaseSession ]);

    Config.set('settings.session.cookie.name', 'xxx');
    Config.set('settings.session.cookie.domain', 'example.com');
    Config.set('settings.session.cookie.httpOnly', false);
    Config.set('settings.session.cookie.path', '/foo');
    Config.set('settings.session.cookie.sameSite', 'lax');
    Config.set('settings.session.cookie.secure', true);

    const response = await request(app)
      .get('/')
      .expect(200);

    strictEqual(response.get('Set-Cookie')[0].startsWith('xxx='), true);
    strictEqual(response.get('Set-Cookie')[0].includes('Domain=example.com'), true);
    strictEqual(response.get('Set-Cookie')[0].includes('httpOnly'), false);
    strictEqual(response.get('Set-Cookie')[0].includes('Path=/foo'), true);
    strictEqual(response.get('Set-Cookie')[0].includes('SameSite=Lax'), true);
    strictEqual(response.get('Set-Cookie')[0].includes('Secure;'), true);
  });

});

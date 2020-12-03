// 3p
import { Nuxt } from 'nuxt';
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseOK } from '@foal/core';
import { strictEqual } from 'assert';

it('Nuxt.js', async () => {
  const nuxt = new Nuxt({});

  await nuxt.ready();

  class AppController {
    @Get('/api/users')
    readUsers() {
      return new HttpResponseOK([
        { name: 'Alix' }
      ]);
    }
  }

  const app = await createApp(AppController, {
    postMiddlewares: [
      nuxt.render
    ]
  });

  await request(app)
    .get('/api/users')
    .expect(200)
    .expect([
      { name: 'Alix' }
    ]);

  await request(app)
    .get('/')
    .set('Accept', 'text/html')
    .expect(200)
    .then(response => {
      strictEqual(response.text.includes('Nuxt.js: Loading app...'), true);
    });
});

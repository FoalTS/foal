// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseNotFound, HttpResponseOK } from '@foal/core';

it('[Docs] Cookbook > 404 Page', async () => {

  class ViewController {
    @Get('/home')
    home() {
      return new HttpResponseOK('You are on the home page!');
    }
  }

  class AppController {
    subControllers = [ ViewController ];

    @Get('*')
    notFound() {
      return new HttpResponseNotFound('The page your are looking for does not exist');
    }
  }

  const app = await createApp(AppController);

  await Promise.all([
    request(app).get('/home').expect(200),
    request(app).get('/nowhere').expect(404)
  ]);

});

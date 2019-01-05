// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseNotFound, HttpResponseOK } from '../src';

it('404', async () => {

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

  const app = createApp(AppController);

  await request(app).get('/home').expect(200);

});

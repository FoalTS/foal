// 3p
import * as request from 'supertest';

// FoalTS
import { Context, controller, createApp, createHttpResponseFile, Get, HttpResponseNotFound } from '@foal/core';

describe('[Docs] Single Page Applications (SPA)', () => {

  it('Using Frontend Routers', () => {
    class ApiController {}

    class AppController {
      subControllers = [
        controller('/api', ApiController),
        // ...
      ];

      @Get('*')
      renderApp(ctx: Context) {
        if (!ctx.request.accepts('html')) {
          return new HttpResponseNotFound();
        }

        return createHttpResponseFile({
          directory: './src/examples/frontend-integration/public',
          file: 'index.html'
        });
      }
    }

    const app = createApp(AppController);

    return Promise.all([
      request(app)
        .get('/pages/1')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*')
        .expect(200)
        .expect('SPA page'),
      request(app)
        .get('/api/customers')
        .set('Accept', 'application/json')
        .expect(404)
    ]);
  });

});

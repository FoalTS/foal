// std
import { join } from 'path';

// 3p
import * as request from 'supertest';

// FoalTS
import { Context, controller, createApp, Get, HttpResponseNotFound, render } from '@foal/core';

describe('[Docs] Frontend Integration > Single Page Applications (SPA)', () => {

  it('Using Frontend Routers', async () => {
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

        return render(join(process.cwd(), 'assets/frontend/public/index.html'));
      }
    }

    const app = await createApp(AppController);

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

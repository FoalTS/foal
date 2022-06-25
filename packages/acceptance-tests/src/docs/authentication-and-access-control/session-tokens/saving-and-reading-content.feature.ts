// 3p
import * as request from 'supertest';
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config,
  Context,
  controller,
  createSession,
  Get,
  HttpResponseNoContent,
  HttpResponseOK,
  IAppController,
  Post,
  ServiceManager,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAppAndSetUpDabaseConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Saving and reading content', () => {

  let closeDatabaseConnection = async () => {};

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    await closeDatabaseConnection();
  });

  it('Example: Usage with premium and free plans', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @UseSessions(/* ... */)
    class ApiController {

      @Post('/subscribe')
      subscribe(ctx: Context) {
        const plan = ctx.session!.get<string>('plan', 'free');
        // ...
        // Not in the documentation
        return new HttpResponseOK(plan);
      }

      @Post('/choose-premium-plan')
      choosePremimumPlan(ctx: Context) {
        ctx.session!.set('plan', 'premium');
        return new HttpResponseNoContent();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController implements IAppController {
      subControllers = [
        controller('/api', ApiController),
      ];
    }

    const services = new ServiceManager();

    let app: any;
    ({ app, closeDatabaseConnection } = await createAppAndSetUpDabaseConnection(AppController, [ DatabaseSession ], { serviceManager: services }));

    const store = services.get(Store);

    const session = await createSession(store);
    await session.commit();

    await request(app)
      .post('/api/subscribe')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .send()
      .expect(200)
      .expect('free');

    await request(app)
      .post('/api/choose-premium-plan')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .send()
      .expect(204);

    await request(app)
      .post('/api/subscribe')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .send()
      .expect(200)
      .expect('premium');
  });

  it('Example: Save content temporarily (flash sessions)', async () => {

    @UseSessions({ required: true })
    class AppController implements IAppController {
      @Post('/add-flash-content')
      addFlashContent(ctx: Context) {
        /* ======================= DOCUMENTATION BEGIN ======================= */
        ctx.session!.set('error', 'Incorrect email or password', { flash: true });
        /* ======================= DOCUMENTATION END ========================= */

        return new HttpResponseOK();
      }

      @Get('/read-flash-content')
      readFlashContent(ctx: Context) {
        return new HttpResponseOK(
          ctx.session!.get<string>('error', 'No error')
        );
      }
    }

    const services = new ServiceManager();
    let app: any;
    ({ app, closeDatabaseConnection } = await createAppAndSetUpDabaseConnection(AppController, [ DatabaseSession ], { serviceManager: services }));

    const store = services.get(Store);

    const session = await createSession(store);
    await session.commit();

    await request(app)
      .get('/read-flash-content')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .expect(200)
      .expect('No error');

    await request(app)
      .post('/add-flash-content')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .send()
      .expect(200);

    await request(app)
      .get('/read-flash-content')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .expect(200)
      .expect('Incorrect email or password');

    await request(app)
      .get('/read-flash-content')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .expect(200)
      .expect('No error');
  });

});

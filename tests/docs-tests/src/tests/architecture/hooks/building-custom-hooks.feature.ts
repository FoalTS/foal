// 3p
import * as request from 'supertest';

// FoalTS
import {
  Context,
  createApp,
  Get,
  getAjvInstance,
  Hook,
  HttpResponseBadRequest,
  HttpResponseOK,
  Post,
} from '@foal/core';

describe('Feature: Building custom hooks', () => {

  it('Example: A simple hook', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {

      @Get('/')
      @Hook(() => {
        // console.log('Receiving GET / request...');
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

  it('Example: A hook that uses the context and a service.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class Logger {
      log(message: string) {
        console.log(`${new Date()} - ${message}`);
      }
    }

    class MyController {

      @Get('/')
      @Hook((ctx, services) => {
        // tslint:disable-next-line
        const logger = services.get(Logger);
        // logger.log('IP: ' + ctx.request.ip);
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

  it('Example: A hook returning an HttpResponse instance.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {

      @Post('/')
      @Hook((ctx: Context) => {
        if (typeof ctx.request.body.name !== 'string') {
          return new HttpResponseBadRequest();
        }
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .post('/')
      .send({ name: 2 })
      .expect(400);

    await request(app)
      .post('/')
      .send({ name: 'hello' })
      .expect(200)
      .expect('Hello world!');
  });

  it('Example: A hook accessing the controller instance.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {

      schema = {
        properties: {
          price: { type: 'number' }
        },
        type: 'object',
      };

      @Post('/')
      @Hook(function(this: MyController, ctx, services) {
        const ajv = getAjvInstance();
        const requestBody = ctx.request.body;
        if (!ajv.validate(this.schema, requestBody)) {
          return new HttpResponseBadRequest(ajv.errors);
        }
      })
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .post('/')
      .send({ price: 'hello' })
      .expect(400);

    await request(app)
      .post('/')
      .send({ price: 2 })
      .expect(200)
      .expect('Hello world!');
  });

});

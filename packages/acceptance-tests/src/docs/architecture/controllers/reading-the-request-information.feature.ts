// 3p
import * as request from 'supertest';

// FoalTS
import {
  Context,
  createApp,
  Get,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
  Put,
  Request,
} from '@foal/core';

describe('Feature: Reading the request information', () => {

  it('Example: Read the Body', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Post('/products')
      createProduct(ctx: Context) {
        const body = ctx.request.body;
        // Do something.
        return new HttpResponseCreated(body);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const body = {
      name: 'milk'
    };

    await request(app)
      .post('/products')
      .send(body)
      .expect(201)
      .expect(body);
  });

  it('Example: Read Path Parameters', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/products/:id')
      readProduct(ctx: Context) {
        const productId = ctx.request.params.id;
        // Do something.
        return new HttpResponseOK({ productId });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const productId = '3';

    await request(app)
      .get(`/products/${productId}`)
      .expect(200)
      .expect({ productId });
  });

  it('Example: Read Query Parameters', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/products')
      readProducts(ctx: Context) {
        const limit = ctx.request.query.limit;
        // Do something.
        return new HttpResponseOK({ limit });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const limit = '3';

    await request(app)
      .get(`/products?limit=${limit}`)
      .expect(200)
      .expect({ limit });
  });

  it('Example: Read Headers', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/')
      index(ctx: Context) {
        const token = ctx.request.get('Authorization');
        // Do something.
        return new HttpResponseOK(token);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const token = 'xxx';

    await request(app)
      .get('/')
      .set('Authorization', token)
      .expect(200)
      .expect(token);
  });

  it('Example: Read Cookies', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Get('/')
      index(ctx: Context) {
        const sessionID: string|undefined = ctx.request.cookies.sessionID;
        // Do something.
        return new HttpResponseOK(sessionID);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const id = 'xxx';

    await request(app)
      .get('/')
      .set('Cookie', [ `sessionID=${id}` ])
      .expect(200)
      .expect(id);
  });

  it('Example: The Controller Method Arguments', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      @Put('/products/:id')
      updateProduct(ctx: Context, request: Request) {
        // Do something.
        return new HttpResponseCreated({ id: request.params.id, body: request.body });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    const id = 'xxx';
    const body = { hello: 'world' };

    await request(app)
      .put(`/products/${id}`)
      .send(body)
      .expect(201)
      .expect({ id, body });
  });

});

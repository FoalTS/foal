// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  createApp,
  Get,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseInternalServerError,
  IAppController,
  renderError
} from '@foal/core';

describe('Feature: Customizing the error handler', () => {

  beforeEach(() => Config.set('settings.logErrors', false));

  afterEach(() => Config.remove('settings.logErrors'));

  it('Example: Reporting errors', async () => {
    let serviceCalledWith: Error|undefined;
    const sendErrorToAnExternalService = (error: Error) => serviceCalledWith = error;

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController implements IAppController {
      @Get('/')
      index() {
        throw new Error('Hello world');
      }

      handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
        sendErrorToAnExternalService(error);

        return renderError(error, ctx);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    strictEqual(serviceCalledWith, undefined);

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(500);

    deepStrictEqual(serviceCalledWith, new Error('Hello world'));
  });

  it('Example: Returning JSON', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController implements IAppController {
      @Get('/')
      index() {
        throw new Error('Hello world');
      }

      handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
        return new HttpResponseInternalServerError({
          err: error.message,
          message: 'An error occured.',
          path: ctx.request.path,
        });
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    return request(app)
      .get('/')
      .expect(500)
      .expect({
        err: 'Hello world',
        message: 'An error occured.',
        path: '/'
      });
  });

  it('Example: Converting errors into 4xx responses', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class PermissionDenied extends Error {}

    class AppController implements IAppController {
      @Get('/')
      index() {
        throw new PermissionDenied();
      }

      handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
        if (error instanceof PermissionDenied) {
          return new HttpResponseForbidden();
        }

        return renderError(error, ctx);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    return request(app)
      .get('/')
      .expect(403);
  });

});

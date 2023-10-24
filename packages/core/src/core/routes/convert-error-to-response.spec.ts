// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { IAppController } from '../app.controller.interface';
import { Config } from '../config';
import { Context, HttpResponse, HttpResponseInternalServerError, isHttpResponseInternalServerError } from '../http';
import { convertErrorToResponse } from './convert-error-to-response';

describe('convertErrorToResponse', () => {

  class AppController implements IAppController {}

  let error: Error;
  let ctx: Context;

  beforeEach(() => {
    error =  new Error('Error for convertErrorToResponse');
    ctx = new Context({});
  });

  context('given the configuration settings.logErrors is true or not defined', () => {

    it('should log the error stack.', async () => {
      let actualMessage: string|undefined;
      let actualError: Error|undefined;

      const logger = {
        error(message: string, { error }: { error: Error }): void {
          actualMessage = message;
          actualError = error;
        }
      }

      await convertErrorToResponse(error, ctx, new AppController(), logger);

      strictEqual(actualMessage, error.message);
      strictEqual(actualError, error);
    });

  });

  context('given the configuration settings.logErrors is false', () => {

    beforeEach(() => Config.set('settings.logErrors', false));

    afterEach(() => Config.remove('settings.logErrors'));

    it('should not log the error.', async () => {
      let actualMessage: string|undefined;
      let actualError: Error|undefined;

      const logger = {
        error(message: string, { error }: { error: Error }): void {
          actualMessage = message;
          actualError = error;
        }
      }

      await convertErrorToResponse(error, ctx, new AppController(), logger);

      strictEqual(actualMessage, undefined);
      strictEqual(actualError, undefined);
    });

  });

  context('given appController.handleError is not defined', () => {

    it('should return an HttpResponseInternalServerError object created by renderError.', async () => {
      const response = await convertErrorToResponse(error, ctx, new AppController(), { error: () => {} });

      if (!isHttpResponseInternalServerError(response)) {
        throw new Error('An HttpResponseInternalServerError should have been returned.');
      }

      strictEqual(response.error, error);
      strictEqual(response.ctx, ctx);
    });

  });

  context('given appController.handleError is defined', () => {

    let error2: Error;

    beforeEach(() => error2 = new Error('Error 2 for convertErrorToResponse'));

    context('given appController.handleError does not throw or reject an error', () => {

      class AppController implements IAppController {
        async handleError(error: Error, ctx: Context): Promise<HttpResponse> {
          return new HttpResponseInternalServerError({
            ctx,
            error,
          });
        }
      }

      it('should return the response returned by handleError.', async () => {
        const response = await convertErrorToResponse(error, ctx, new AppController(), { error: () => {} });

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError should have been returned.');
        }

        deepStrictEqual(response.body, { error, ctx });
      });

    });

    context('given appController.handleError throws an error', () => {

      class AppController implements IAppController {
        handleError(error: Error, ctx: Context): HttpResponse {
          throw error2;
        }
      }

      it('should return an HttpResponseInternalServerError object created by renderError.', async () => {
        const response = await convertErrorToResponse(error, ctx, new AppController(), { error: () => {} });

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError should have been returned.');
        }

        strictEqual(response.error, error2);
        strictEqual(response.ctx, ctx);
      });

    });

    context('given appController.handleError rejects an error', () => {

      class AppController implements IAppController {
        async handleError(error: Error, ctx: Context): Promise<HttpResponse> {
          throw error2;
        }
      }

      it('should return an HttpResponseInternalServerError object created by renderError.', async () => {
        const response = await convertErrorToResponse(error, ctx, new AppController(), { error: () => {} });

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError should have been returned.');
        }

        strictEqual(response.error, error2);
        strictEqual(response.ctx, ctx);
      });

    });

  });

});

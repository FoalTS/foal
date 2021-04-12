// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { Config } from '@foal/core';

// FoalTS
import { ISocketIOController, WebsocketContext, WebsocketErrorResponse } from '../architecture'
import { convertErrorToWebsocketResponse } from './convert-error-to-websocket-response';

describe('convertErrorToResponse', () => {

  class SocketIOController implements ISocketIOController {}

  let error: Error;
  let ctx: WebsocketContext;

  beforeEach(() => {
    error =  new Error('Error for convertErrorToWebsocketResponse');
    ctx = new WebsocketContext('foo event', {});
    Config.set('settings.debug', true);
  });

  afterEach(() => Config.remove('settings.debug'));

  context('given the configuration settings.logErrors is true or not defined', () => {

    it('should log the error stack.', async () => {
      let message = '';
      const log = (msg: string) => message = msg;

      await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), log);

      strictEqual(message, error.stack);
    });

  });

  context('given the configuration settings.logErrors is false', () => {

    beforeEach(() => Config.set('settings.logErrors', false));

    afterEach(() => Config.remove('settings.logErrors'));

    it('should not log the error stack.', async () => {
      let message = '';
      const log = (msg: string) => message = msg;

      await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), log);

      strictEqual(message, '');
    });

  });

  context('given socketioController.handleError is not defined', () => {

    it('should return an WebsocketErrorResponse object created by renderWebsocketError.', async () => {
      const response = await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), () => {});

      if (!(response instanceof WebsocketErrorResponse)) {
        throw new Error('An WebsocketErrorResponse should have been returned.');
      }

      strictEqual(response.payload.message, 'Error for convertErrorToWebsocketResponse');
    });

  });

  context('given socketioController.handleError is defined', () => {

    let error2: Error;

    beforeEach(() => error2 = new Error('Error 2 for convertErrorToResponse'));

    context('given socketioController.handleError does not throw or reject an error', () => {

      class SocketIOController implements ISocketIOController {
        async handleError(error: Error, ctx: WebsocketContext) {
          return new WebsocketErrorResponse({
            ctx,
            error,
          });
        }
      }

      it('should return the response returned by handleError.', async () => {
        const response = await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), () => {});

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('An WebsocketErrorResponse should have been returned.');
        }

        deepStrictEqual(response.payload, { error, ctx });
      });

    });

    context('given socketioController.handleError throws an error', () => {

      class SocketIOController implements ISocketIOController {
        handleError(error: Error, ctx: WebsocketContext): Promise<WebsocketErrorResponse> {
          throw error2;
        }
      }

      it('should return an WebsocketErrorResponse object created by renderWebsocketError.', async () => {
        const response = await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), () => {});

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('An WebsocketErrorResponse should have been returned.');
        }

        strictEqual(response.payload.message, error2.message);
      });

    });

    context('given socketioController.handleError rejects an error', () => {

      class SocketIOController implements ISocketIOController {
        async handleError(error: Error, ctx: WebsocketContext): Promise<WebsocketErrorResponse> {
          throw error2;
        }
      }

      it('should return an WebsocketErrorResponse object created by renderWebsocketError.', async () => {
        const response = await convertErrorToWebsocketResponse(error, ctx, new SocketIOController(), () => {});

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('An WebsocketErrorResponse should have been returned.');
        }

        strictEqual(response.payload.message, error2.message);
      });

    });

  });

});

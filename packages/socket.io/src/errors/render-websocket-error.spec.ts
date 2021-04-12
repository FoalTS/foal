// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import { Config} from '@foal/core';

// FoalTS
import { renderWebsocketError } from './render-websocket-error';
import { WebsocketContext, WebsocketErrorResponse } from '../architecture';

describe('renderWebsocketError', () => {

  let ctx: WebsocketContext;
  let error: Error;

  class PermissionError extends Error {
    readonly name = 'PermissionError';
  }

  beforeEach(() => {
    ctx = new WebsocketContext('foo event', {});
    error = new PermissionError('Error used in renderWebsocketError');
  });

  function testErrorObject() {
    it(
      'should return an WebsocketErrorResponse object.',
      async () => {
        const response = await renderWebsocketError(error, ctx);

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('The function should have returned an WebsocketErrorResponse object.');
        }
      }
    );
  }

  context('given the configuration settings.debug is false or not defined', () => {

    testErrorObject();

    it('should return a response with the proper payload.', async () => {
      const response = await renderWebsocketError(error, ctx);
      deepStrictEqual(response.payload, {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error has occurred.'
      });
    });

  });

  context('given the configuration settings.debug is true', () => {

    beforeEach(() => Config.set('settings.debug', true));

    afterEach(() => Config.remove('settings.debug'));

    describe('returns a response whose payload', () => {

      testErrorObject();

      it('should contain the name of the error.', async () => {
        const response = await renderWebsocketError(error, ctx);

        const { name } = response.payload;
        strictEqual(name, error.name);
      });

      it('should contain the filename where the error was thrown.', async () => {
        const response = await renderWebsocketError(error, ctx);

        const { filename } = response.payload;
        strictEqual(filename, 'render-websocket-error.util.spec.ts');
      });

      it('should contain the line and the column where the error was thrown.', async () => {
        const response = await renderWebsocketError(error, ctx);

        const { column, line } = response.payload;
        strictEqual(typeof column, 'number');
        strictEqual(typeof line, 'number');

        // NaN is of type "number".
        notStrictEqual(column, NaN)
        notStrictEqual(line, NaN)
      });

      it('should contain the message of the error.', async () => {
        const response = await renderWebsocketError(error, ctx);

        const { message } = response.payload;
        strictEqual(message, error.message);
      });

      it('should contain the call stack of the error.', async () => {
        const response = await renderWebsocketError(error, ctx);

        const { stack } = response.payload;
        strictEqual(stack, error.stack);
      });

    });

  });

});

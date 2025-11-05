// std
import { doesNotReject, strictEqual } from 'assert';

// FoalTS
import { renderError } from './render-error';
import { Context, isHttpResponseInternalServerError } from '../http';
import { Config } from '../config';

describe('renderError', () => {

  let ctx: Context;
  let error: Error;

  class PermissionError extends Error {
    readonly name = 'PermissionError';
  }

  beforeEach(() => {
    ctx = new Context({});
    error = new PermissionError('Error used in renderError');
  });

  function testErrorObject() {
    it(
      'should return an HttpResponseInternalServerError object with the proper "ctx" and "error" properties.',
      async () => {
        const response = await renderError(error, ctx);

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('The function should have returned an HttpResponseInternalServerError object.');
        }

        strictEqual(response.ctx, ctx);
        strictEqual(response.error, error);
      }
    );
  }

  context('given the configuration settings.debug is false or not defined', () => {

    testErrorObject();

    it('should return a response with the proper body.', async () => {
      const default500page = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
      + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

      const response = await renderError(error, ctx);
      strictEqual(response.body, default500page);
    });

  });

  context('given the configuration settings.debug is true', () => {

    beforeEach(() => Config.set('settings.debug', true));

    afterEach(() => Config.remove('settings.debug'));

    testErrorObject();

    describe('returns a response whose body', () => {

      it('should contain the name of the error.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        strictEqual(text.includes(`<h2>${error.name}</h2>`), true);
      });

      it('should contain the filename where the error was thrown.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        try {
          // When running the tests with ts-node
          strictEqual(text.includes('<span>render-error.spec.ts</span>'), true);
        } catch {
          // When running the tests after compilation to JavaScript
          strictEqual(text.includes('<span>render-error.spec.js</span>'), true);
        }
      });

      it('should contain the line and the column where the error was thrown.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        const rex = /<span class="location">line (\d+), column (\d+)<\/span>/;
        if (!rex.exec(text)) {
          throw new Error('Line and/or column not found.');
        }
      });

      it('should contain the message of the error.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        strictEqual(text.includes(`<pre class="message">${error.message}</pre>`), true);
      });

      it('should contain the call stack of the error.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        strictEqual(text.includes(`<pre>${error.stack}</pre>`), true);
      });

      it('should contain an information regarding the configuration.', async () => {
        const response = await renderError(error, ctx);

        const text: string = response.body;
        strictEqual(text.includes('You are seeing this error because you have settings.debug set to true in your configuration file.'), true);
      });

      it('should not throw an error is the format of the stack trace is unexpected.', async () => {
        const error = new Error();
        error.stack = 'hello world';

        await doesNotReject(() => renderError(error, ctx));
      })

    });

  });

});

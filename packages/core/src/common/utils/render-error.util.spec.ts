// std
import { strictEqual } from 'assert';

// FoalTS
import { Context, isHttpResponseInternalServerError } from '../../core';
import { renderError } from './render-error.util';

describe('renderError', () => {

  let ctx: Context;

  before(() => ctx = new Context({}));

  afterEach(() => delete process.env.SETTINGS_DEBUG);

  const default500page = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
  + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

  it('should return an HttpResponseInternalServerError object.', async () => {
    const response = await renderError(new Error(), ctx);
    strictEqual(isHttpResponseInternalServerError(response), true);
  });

  it('should return a response which body is the default html 500 page with no stack'
      + ' if debug is not defined.', async () => {
    const response = await renderError(new Error(), ctx);
    strictEqual(response.body, default500page);
  });

  it('should return a response which body is the default html 500 page with no stack'
      + ' if debug is false.', async () => {
    process.env.SETTINGS_DEBUG = 'false';

    const response = await renderError(new Error(), ctx);
    strictEqual(response.body, default500page);
  });

  it('should return a response which body is the debug html 500 page with a stack'
      + ' if debug is true.', async () => {
    process.env.SETTINGS_DEBUG = 'true';
    const err = new Error('This is an error');
    const response = await renderError(err, ctx);

    const text: string = response.body;
    strictEqual(text.includes('Error: This is an error'), true, '"Error: This is an error" not found');
    strictEqual(text.includes('at Context.'), true, '"at Context." not found');
    strictEqual(
      text.includes(
        'You are seeing this error because you have settings.debug set to true in your configuration file.'
      ),
      true,
      '"You are seeing this error because" not found.'
    );
  });

});

// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// FoalTS
import { Config, Context, HttpResponseInternalServerError } from '../../core';
import { renderToString } from './render.util';

const page500 = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

/**
 * Render the default HTML page when an error is thrown or rejected in the application.
 *
 * The page is different depending on if the configuration key `settings.debug` is
 * true or false.
 *
 * @export
 * @param {Error} error - The error thrown or rejected.
 * @param {Context} ctx - The Context. object.
 * @returns {Promise<HttpResponseInternalServerError>} The HTTP response.
 */
export async function renderError(error: Error, ctx: Context): Promise<HttpResponseInternalServerError> {
  const template = await promisify(readFile)(join(__dirname, '500.debug.html'), 'utf8');

  if (!Config.get('settings.debug', 'boolean')) {
    return new HttpResponseInternalServerError(page500);
  }

  return new HttpResponseInternalServerError(renderToString(template, {
    message: error.message,
    name: error.name,
    stack: error.stack
  }));
}

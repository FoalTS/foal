// std
import { readFile } from 'node:fs/promises';
import { basename, join } from 'path';

// FoalTS
import { Context, HttpResponseInternalServerError } from '../http';
import { Config } from '../config';
import { renderToString } from './render';

/**
 * Renders the default HTML page when an error is thrown or rejected in the application.
 *
 * The page is different depending on if the configuration key `settings.debug` is
 * true or false.
 *
 * @export
 * @param {Error} error - The error thrown or rejected.
 * @param {Context} ctx - The Context object.
 * @returns {Promise<HttpResponseInternalServerError>} The HTTP response.
 */
export async function renderError(error: Error, ctx: Context): Promise<HttpResponseInternalServerError> {
  let body = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
  + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

  if (Config.get('settings.debug', 'boolean')) {
    const template = await readFile(join(__dirname, '500.debug.html'), 'utf8');

    const rex = /at (.*) \((.*):(\d+):(\d+)\)/;
    const [ , , path, line, column ] = Array.from(rex.exec(error.stack || '') || []);

    body = renderToString(template, {
      column,
      filename: basename(path || ''),
      line,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  }

  return new HttpResponseInternalServerError(body, { ctx, error });
}

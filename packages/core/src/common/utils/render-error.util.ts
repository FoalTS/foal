// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// FoalTS
import { Config, Context, HttpResponseInternalServerError } from '../../core';
import { renderToString } from './render.util';

const page500 = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

export async function renderError(error: Error, ctx: Context): Promise<HttpResponseInternalServerError> {
  const template = await promisify(readFile)(join(__dirname, '500.debug.html'), 'utf8');

  if (!Config.get('settings.debug')) {
    return new HttpResponseInternalServerError(page500);
  }

  return new HttpResponseInternalServerError(renderToString(template, {
    message: error.message,
    name: error.name,
    stack: error.stack
  }));
}

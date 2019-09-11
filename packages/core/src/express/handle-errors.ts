import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { renderToString } from '../common/utils/render.util';

const page500 = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

/**
 * Create an express middleware to return a 500 HTML page if an error is thrown and is not caught.
 *
 * @export
 * @param {boolean} debug - Specify if the error stack should be included in the page.
 * @param {*} [logFn=console.error]
 * @returns The express middleware.
 */
export function handleErrors(debug: boolean, logFn = console.error) {
  return async (err, req, res, next) => {
    if (err.expose && err.status) {
      next(err);
      return;
    }

    logFn(err.stack);

    if (!debug) {
      res.status(500).send(page500);
      return;
    }

    const template = await promisify(readFile)(join(__dirname, '500.debug.html'), 'utf8');
    res.status(500).send(
      renderToString(template, {
        message: err.message,
        name: err.name,
        stack: err.stack,
      })
    );
  };
}

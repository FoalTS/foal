// FoalTS
import { renderError } from '../common';
import { Context } from '../core';

/**
 * Create an express middleware to return a 500 HTML page if an error is thrown and is not caught.
 *
 * @export
 * @param {*} [logFn=console.error]
 * @returns The express middleware.
 */
export function handleErrors(logFn = console.error) {
  return async (err, req, res, next) => {
    if (err.expose && err.status) {
      next(err);
      return;
    }

    logFn(err.stack);

    const response = await renderError(err, { ctx: new Context(req) });
    res.status(response.statusCode).send(response.body);
  };
}

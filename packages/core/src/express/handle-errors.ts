// FoalTS
import { ErrorRequestHandler } from 'express';
import { renderError } from '../common';
import { Context, HttpResponse } from '../core';
import { CreateAppOptions } from './create-app';
import { sendResponse } from './send-response';

/**
 * Create an express middleware to return a 500 HTML page if an error is thrown and is not caught.
 *
 * @export
 * @param {*} [logFn=console.error]
 * @returns The express middleware.
 */
export function handleErrors(
  options: CreateAppOptions, appController: any, logFn = console.error
): ErrorRequestHandler {
  return async (err, req, res, next) => {
    if (err.expose && err.status) {
      next(err);
      return;
    }

    logFn(err.stack);

    let response: HttpResponse;
    if (options.methods && options.methods.handleError && appController.handleError) {
      try {
        response = await appController.handleError(err, req);
      } catch (error) {
        response = await renderError(error, { ctx: new Context(req) });
      }
    } else {
      response = await renderError(err, { ctx: new Context(req) });
    }
    sendResponse(response, res);
  };
}

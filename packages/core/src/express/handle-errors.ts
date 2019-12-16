// 3p
import { ErrorRequestHandler, Request } from 'express';

// FoalTS
import { renderError } from '../common';
import { Context, HttpResponse } from '../core';
import { CreateAppOptions } from './create-app';
import { sendResponse } from './send-response';

function getErrorAndContext(err, req: Request): { err: Error, ctx: Context } {
  if (err.type === 'FOAL_ERROR') { // Little hack.
    return {
      ctx: err.ctx,
      err: err.error
    };
  }
  return {
    ctx: new Context(req),
    err,
  };
}

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
  return async (mErr, req, res, next) => {
    if (mErr.expose && mErr.status) {
      next(mErr);
      return;
    }

    const { err, ctx } = getErrorAndContext(mErr, req);

    logFn(err.stack);

    let response: HttpResponse;
    if (options.methods && options.methods.handleError && appController.handleError) {
      try {
        response = await appController.handleError(err, ctx);
      } catch (error) {
        response = await renderError(err, ctx);
      }
    } else {
      response = await renderError(err, ctx);
    }
    sendResponse(response, res);
  };
}

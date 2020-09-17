import { renderError } from '../common';
import { Config, Context, HttpResponse } from '../core';
import { IAppController } from './app.controller.interface';

export async function convertErrorToResponse(
  error: Error, ctx: Context, appController: IAppController, log = console.error
): Promise<HttpResponse> {
  if (Config.get('settings.logErrors', 'boolean', true)) {
    log(error.stack);
  }

  if (appController.handleError) {
    try {
      return await appController.handleError(error, ctx);
    } catch (error2) {
      return renderError(error2, ctx);
    }
  }

  return renderError(error, ctx);
}

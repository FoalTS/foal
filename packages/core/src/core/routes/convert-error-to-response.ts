import { renderError } from '../../common';
import { IAppController } from '../app.controller.interface';
import { Config } from '../config';
import { Context, HttpResponse } from '../http';

export async function convertErrorToResponse(
  error: Error, ctx: Context, appController: IAppController, log = console.error
): Promise<HttpResponse> {
  if (Config.get('settings.logErrors', 'boolean', true)) {
    log(error.stack);
  }

  if (appController.handleError) {
    try {
      return await appController.handleError(error, ctx);
    } catch (error2: any) {
      return renderError(error2, ctx);
    }
  }

  return renderError(error, ctx);
}

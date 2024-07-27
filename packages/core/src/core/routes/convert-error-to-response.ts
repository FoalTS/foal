import { renderError } from '../templates';
import { IAppController } from '../app.controller.interface';
import { Config } from '../config';
import { Context, HttpResponse } from '../http';

export async function convertErrorToResponse(
  error: Error,
  ctx: Context,
  appController: IAppController,
  logger: {
    error: (message: string, params: { error: Error }) => void
  }
): Promise<HttpResponse> {
  if (Config.get('settings.logErrors', 'boolean', true)) {
    logger.error(error.message, { error });
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

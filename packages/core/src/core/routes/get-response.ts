import { Logger } from '../logging';
import { IAppController } from '../app.controller.interface';
import { HookPostFunction } from '../hooks';
import { Context, HttpResponse, isHttpResponse } from '../http';
import { ServiceManager } from '../service-manager';
import { convertErrorToResponse } from './convert-error-to-response';
import { Route } from './route.interface';

export async function getResponse(
  route: Route, ctx: Context, services: ServiceManager, appController: IAppController
): Promise<HttpResponse> {
  const logger = services.get(Logger);

  let response: undefined | HttpResponse;

  const hookPostFunctions: HookPostFunction[] = [];

  for (const hook of route.hooks) {
    let result: HttpResponse | HookPostFunction | void;
    try {
      result = await hook(ctx, services);
    } catch (error: any) {
      result = await convertErrorToResponse(error, ctx, appController, logger);
    }
    if (isHttpResponse(result)) {
      response = result;
      break;
    } else if (typeof result === 'function') {
      hookPostFunctions.unshift(result);
    }
  }

  if (!isHttpResponse(response)) {
    try {
      response = await route.controller[route.propertyKey](ctx, ctx.request);
    } catch (error: any) {
      response = await convertErrorToResponse(error, ctx, appController, logger);
    }
  }

  if (!isHttpResponse(response)) {
    const error = new Error(`The controller method "${route.propertyKey}" should return an HttpResponse.`);
    response = await convertErrorToResponse(error, ctx, appController, logger);
  }

  for (const postFn of hookPostFunctions) {
    try {
      await postFn(response);
    } catch (error: any) {
      response = await convertErrorToResponse(error, ctx, appController, logger);
    }
  }

  return response;
}

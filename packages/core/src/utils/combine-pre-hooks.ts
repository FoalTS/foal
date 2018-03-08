import { HttpResponse, isHttpResponse } from '../classes/http-responses';
import { ServiceManager } from '../classes/service-manager';
import { Context, PreHook } from '../interfaces';

export function combinePreHooks(preHooks: PreHook[]): PreHook {
  return async (ctx: Context, services: ServiceManager) => {
    for (const preHook of preHooks) {
      const result = await preHook(ctx, services);
      if (result && isHttpResponse(result)) {
        return result;
      }
    }
  };
}

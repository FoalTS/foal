import { Context, Hook } from '../interfaces';
import { ServiceManager } from '../classes/service-manager';
import { HttpResponse } from '../classes/http-responses';

export function combineHooks(hooks: Hook[]): Hook {
  return async (ctx: Context, services: ServiceManager) => {
    for (const hook of hooks) {
      const result = await hook(ctx, services);
      if (result instanceof HttpResponse) {
        return result;
      }
    }
  }
}

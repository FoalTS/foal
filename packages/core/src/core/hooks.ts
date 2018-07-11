// 3p
import 'reflect-metadata';

// FoalTS
import { Context, HttpResponse, isHttpResponse } from './http';
import { ServiceManager } from './service-manager';

// not void. HttpResponse or HttpResponse | void (same with promises)
export type HookFunction = (ctx: Context, services: ServiceManager) => any;

// TODO: delete this.
export type PreHook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
export type PostHook = (ctx: Context, services: ServiceManager) => void | Promise<void>;

export function Hook(hookFunction: HookFunction) {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: HookFunction[] = Reflect.getOwnMetadata('hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('hooks', hooks, target, propertyKey as string);
  };
}

export function combinePreHooks(preHooks: PreHook[]): PreHook {
  return async (ctx: Context, services: ServiceManager) => {
    for (const preHook of preHooks) {
      const response = await preHook(ctx, services);
      if (response && isHttpResponse(response)) {
        return response;
      }
    }
  };
}

// 3p
import 'reflect-metadata';

// FoalTS
import { Context, HttpResponse } from './http';
import { ServiceManager } from './service-manager';

export type HookPostFunction = (ctx: Context, services: ServiceManager, response: HttpResponse) => void;
export type HookFunction = (ctx: Context, services: ServiceManager) =>
  void | HttpResponse | HookPostFunction | Promise <void | HttpResponse | HookPostFunction>;
export type HookDecorator = (target: any, propertyKey?: string) => any;

export function Hook(hookFunction: HookFunction): HookDecorator {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: HookFunction[] = Reflect.getOwnMetadata('hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('hooks', hooks, target, propertyKey as string);
  };
}

export function getHookFunction(hook: HookDecorator): HookFunction {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('hooks', Foo)[0];
}

// 3p
import 'reflect-metadata';

// FoalTS
import { Context } from '../contexts';
import { ServiceManager } from '../service-manager';

// not void. HttpResponse or HttpResponse | void (same with promises)
export type HookFunction = (ctx: Context, services: ServiceManager, next: () => Promise<void>) => void;

export function Hook(hookFunction: HookFunction) {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: HookFunction[] = Reflect.getMetadata('hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('hooks', hooks, target, propertyKey as string);
  };
}

// 3p
import 'reflect-metadata';

// FoalTS
import { Config } from './config';
import { Context, HttpResponse } from './http';
import { OpenApiDecorator } from './openapi';
import { ServiceManager } from './service-manager';

/**
 * Interface of a function that can be returned in a hook function. This function is then
 * executed after the controller method execution.
 *
 * @export
 */
export type HookPostFunction = (response: HttpResponse) => void | Promise<void>;

/**
 * Interface of a function from which a hook can be created.
 *
 * @export
 */
export type HookFunction<C = Context> = (ctx: C, services: ServiceManager) =>
  void | HttpResponse | HookPostFunction | Promise <void | HttpResponse | HookPostFunction>;

/**
 * Interface of a hook. It is actually the interface of a decorator.
 *
 * @export
 */
export type HookDecorator = (target: any, propertyKey?: string) => any;

/**
 * Create a hook from one or several functions.
 *
 * @export
 * @param {HookFunction[]} hookFunction - The function from which the hook should be created.
 * @returns {HookDecorator} - The hook decorator.
 */
export function Hook<C = Context>(
  hookFunction: HookFunction<C>, openApiDecorators: OpenApiDecorator[] = [], options: { openapi?: boolean } = {}
): HookDecorator {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: HookFunction<C>[] = Reflect.getOwnMetadata('hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('hooks', hooks, target, propertyKey as string);

    // tslint:disable-next-line
    if (!(options.openapi ?? Config.get('settings.openapi.useHooks', 'boolean', true))) {
      return;
    }

    for (const openApiDecorator of openApiDecorators.reverse()) {
      openApiDecorator(target, propertyKey);
    }
  };
}

/**
 * Get the function from which the hook was made.
 *
 * @export
 * @param {HookDecorator} hook - The hook decorator.
 * @returns {HookFunction} The hook function.
 */
export function getHookFunction(hook: HookDecorator): HookFunction {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('hooks', Foo)[0];
}

/**
 * Get the functions from which the hook was made.
 *
 * @export
 * @param {HookDecorator} hook - The hook decorator.
 * @returns {HookFunction[]} The hook functions.
 */
export function getHookFunctions(hook: HookDecorator): HookFunction[] {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('hooks', Foo);
}

/**
 * Group multiple hooks into a new one.
 *
 * @export
 * @param {...HookDecorator[]} hookDecorators - The hooks to merge.
 * @returns {HookDecorator} The new hook.
 */
export function MergeHooks(...hookDecorators: HookDecorator[]): HookDecorator {
  return (target: any, propertyKey?: string) => {
    for (const hookDecorator of hookDecorators.reverse()) {
      hookDecorator(target, propertyKey);
    }
  };
}

// 3p
import 'reflect-metadata';
import { ServiceManager } from '@foal/core';

// FoalTS
import { WebsocketErrorResponse, WebsocketResponse } from './websocket-responses';
import { WebsocketContext } from './websocket-context';

/**
 * Interface of a function that can be returned in a Websocket hook function. This function is then
 * executed after the controller method execution.
 *
 * @export
 */
export type WebsocketHookPostFunction = (response: WebsocketResponse|WebsocketErrorResponse) => void | Promise<void>;

/**
 * Interface of a function from which a Websocket hook can be created.
 *
 * @export
 */
export type WebsocketHookFunction = (ctx: WebsocketContext, services: ServiceManager) =>
  void | WebsocketResponse | WebsocketErrorResponse | WebsocketHookPostFunction |
  Promise <void | WebsocketResponse | WebsocketErrorResponse | WebsocketHookPostFunction>;

/**
 * Interface of a Websocket hook. It is actually the interface of a decorator.
 *
 * @export
 */
export type WebsocketHookDecorator = (target: any, propertyKey?: string) => any;

/**
 * Creates a Websocket hook from one or several functions.
 *
 * @export
 * @param {WebsocketHookFunction[]} hookFunction - The function from which the hook should be created.
 * @returns {WebsocketHookDecorator} - The hook decorator.
 */
export function WebsocketHook(hookFunction: WebsocketHookFunction): WebsocketHookDecorator {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: WebsocketHookFunction[] = Reflect.getOwnMetadata('websocket-hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('websocket-hooks', hooks, target, propertyKey as string);
  };
}

/**
 * Gets the function from which the hook was made.
 *
 * @export
 * @param {WebsocketHookDecorator} hook - The hook decorator.
 * @returns {WebsocketHookFunction} The hook function.
 */
export function getWebsocketHookFunction(hook: WebsocketHookDecorator): WebsocketHookFunction {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('websocket-hooks', Foo)[0];
}

/**
 * Gets the functions from which the hook was made.
 *
 * @export
 * @param {WebsocketHookDecorator} hook - The hook decorator.
 * @returns {WebsocketHookFunction[]} The hook functions.
 */
export function getWebsocketHookFunctions(hook: WebsocketHookDecorator): WebsocketHookFunction[] {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('websocket-hooks', Foo);
}

/**
 * Group multiple Websocket hooks into a new one.
 *
 * @export
 * @param {...WebsocketHookDecorator[]} hookDecorators - The hooks to merge.
 * @returns {WebsocketHookDecorator} The new hook.
 */
export function MergeWebsocketHooks(...hookDecorators: WebsocketHookDecorator[]): WebsocketHookDecorator {
  return (target: any, propertyKey?: string) => {
    for (const hookDecorator of hookDecorators.reverse()) {
      hookDecorator(target, propertyKey);
    }
  };
}

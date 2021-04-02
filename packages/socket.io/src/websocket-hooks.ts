// 3p
import 'reflect-metadata';
import { ServiceManager } from '@foal/core';

// FoalTS
import { WebsocketErrorResponse, WebsocketResponse } from './websocket-responses';
import { WebsocketContext } from './websocket-context';

export type WebsocketHookPostFunction = (response: WebsocketResponse|WebsocketErrorResponse) => void | Promise<void>;

export type WebsocketHookFunction = (ctx: WebsocketContext, services: ServiceManager) =>
  void | WebsocketResponse | WebsocketErrorResponse | WebsocketHookPostFunction |
  Promise <void | WebsocketResponse | WebsocketErrorResponse | WebsocketHookPostFunction>;

export type WebsocketHookDecorator = (target: any, propertyKey?: string) => any;

export function WebsocketHook(hookFunction: WebsocketHookFunction): WebsocketHookDecorator {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const hooks: WebsocketHookFunction[] = Reflect.getOwnMetadata('websocket-hooks', target, propertyKey as string) || [];
    hooks.unshift(hookFunction);
    Reflect.defineMetadata('websocket-hooks', hooks, target, propertyKey as string);
  };
}

export function getWebsocketHookFunction(hook: WebsocketHookDecorator): WebsocketHookFunction {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('websocket-hooks', Foo)[0];
}

export function getWebsocketHookFunctions(hook: WebsocketHookDecorator): WebsocketHookFunction[] {
  @hook
  class Foo {}

  return Reflect.getOwnMetadata('websocket-hooks', Foo);
}

export function MergeWebsocketHooks(...hookDecorators: WebsocketHookDecorator[]): WebsocketHookDecorator {
  return (target: any, propertyKey?: string) => {
    for (const hookDecorator of hookDecorators.reverse()) {
      hookDecorator(target, propertyKey);
    }
  };
}

// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '@foal/core';

export function wsController<T>(eventName: string, controllerClass: Class<T>): Class<T> {
  Reflect.defineMetadata('websocket-event-name', eventName, controllerClass);
  return controllerClass;
}

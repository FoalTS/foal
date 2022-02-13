// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '@foal/core';

/**
 * Defines the prefix of the event names of a controller class. This function is usually called
 * when adding the controller as a sub-controller.
 *
 * @export
 * @template T
 * @param {string} eventName - The event name prefix.
 * @param {Class<T>} controllerClass - The controller class.
 * @returns {Class<T>}
 */
export function wsController<T>(eventName: string, controllerClass: Class<T>): Class<T> {
  Reflect.defineMetadata('websocket-event-name', eventName, controllerClass);
  return controllerClass;
}

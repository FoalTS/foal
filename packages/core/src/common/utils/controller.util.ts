// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../../core';

/**
 * Define the HTTP path of a controller class. This function is usually called
 * when adding the controller as a sub-controller.
 *
 * @export
 * @template T
 * @param {string} path - The HTTP path.
 * @param {Class<T>} controllerClass - The controller class.
 * @returns {Class<T>} The controller class.
 */
export function controller<T>(path: string, controllerClass: Class<T>): Class<T> {
  Reflect.defineMetadata('path', path, controllerClass);
  return controllerClass;
}

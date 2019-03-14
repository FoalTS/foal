// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../../core';

/**
 * Define the HTTP path of a controller class. This function is usually called
 * when adding the controller as a sub-controller.
 *
 * @export
 * @param {string} path - The HTTP path.
 * @param {Class} controllerClass - The controller class.
 * @returns {Class} The controller class.
 */
export function controller(path: string, controllerClass: Class): Class {
  Reflect.defineMetadata('path', path, controllerClass);
  return controllerClass;
}

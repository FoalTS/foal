// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';
import { createControllerOrService } from './service-manager';

/**
 * Create a new controller with its dependencies.
 *
 * @export
 * @template Controller
 * @param {Class<Controller>} controllerClass - The controller class.
 * @param {object} [dependencies] - An object which key/values are the controller properties/instances.
 * @returns {Controller} - The created controller.
 */
export function createController<Controller>(
  controllerClass: Class<Controller>, dependencies?: object
): Controller {
  return createControllerOrService(controllerClass, dependencies);
}

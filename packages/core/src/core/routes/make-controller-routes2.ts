// FoalTS
import { Class } from '../class.interface';
import { HookFunction } from '../hooks';
import { ServiceManager } from '../service-manager';
import { Route } from './route.interface';
import { getMetadata, join } from './utils';

/**
 * Recursively get the property names of an object and its prototypes.
 *
 * @param {(object|null)} obj - The object.
 * @returns {string[]} The property names.
 */
export function getMethods(obj: object|null): string[] {
  if (obj === Object.prototype) { return []; }
  return Object.getOwnPropertyNames(obj).concat(getMethods(Object.getPrototypeOf(obj)));
}

/**
 * Recursively create the routes of a controller and its subcontrollers from the
 * controller class definition.
 *
 * @export
 * @param {string} parentPath - Prefix of all the route paths.
 * @param {HookFunction[]} parentHooks - First hooks of all the route hooks.
 * @param {Class} controllerClass - The controller class.
 * @param {ServiceManager} services - The application services.
 * @returns {Route[]} The created routes.
 */

export function* makeControllerRoutes2(parentPath: string, parentHooks: HookFunction[],
                                       controllerClass: Class, services: ServiceManager): Generator<Route> {
  const controllerHooks = getMetadata('hooks', controllerClass) as HookFunction[] || [];
  const controllerPath = getMetadata('path', controllerClass) as string|undefined;

  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);

  const leftPath = join(parentPath, controllerPath);
  const leftHooks = parentHooks.concat(controllerHooks.map(hook => hook.bind(controller)));

  for (const controllerClass of controller.subControllers || []) {
    yield* makeControllerRoutes2(leftPath, leftHooks, controllerClass, services);
  }

  for (const propertyKey of getMethods(controllerClass.prototype)) {
    if (propertyKey === 'constructor') { continue; }

    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);
    if (httpMethod) {
      const methodPath = getMetadata('path', controllerClass, propertyKey) as string|undefined;
      const methodHooks = getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [];
      const path = join(leftPath, methodPath);
      const hooks = [ ...leftHooks, ...methodHooks.map(hook => hook.bind(controller)) ];
      yield { controller, hooks, httpMethod, path, propertyKey };
    }
  }
}

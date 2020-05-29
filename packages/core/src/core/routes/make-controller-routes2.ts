// FoalTS
import { getApiCompleteOperation, getApiComponents, getApiInfo, getApiTags, IApiInfo, IOpenAPI } from '../../openapi';
import { Class } from '../class.interface';
import { HookFunction } from '../hooks';
import { OpenApi } from '../openapi';
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

 // TODO: <T extends boolean>(..., openapi): Generator<T extends true ? { route, openapi }, { route }>
export function* makeControllerRoutes2(controllerClass: Class, services: ServiceManager): Generator<Route> {
  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);
  const openApi = services.get(OpenApi);

  // TODO: If openapi && Config.get('settings.openpi')

  // TODO: save the controllers
  // TODO: The service or this function should prefix the paths with a slash if there is not.
  // TODO: throw error if dupplicated paths
  // TODO: gather same methods under their shared path

  const info = getApiInfo(controllerClass);
  if (info) {
    const document: IOpenAPI = {
      info: typeof info === 'function' ? info(controller) : info,
      openapi: '3.0.0',
      paths: {}
    };

    const operation = getApiCompleteOperation(controllerClass, controller);
    if (operation.servers) {
      document.servers = operation.servers;
    }
    if (operation.security) {
      document.security = operation.security;
    }
    if (operation.externalDocs) {
      document.externalDocs = operation.externalDocs;
    }

    // TODO: use mergeComponents
    const components = getApiComponents(controllerClass, controller);
    if (Object.keys(components).length > 0) {
      document.components = components;
    }

    // TODO: use mergeTags
    const tags = getApiTags(controllerClass);
    if (tags) {
      document.tags = tags;
    }

    openApi.addDocument(controllerClass, document);
  }

  const controllerHooks = (getMetadata('hooks', controllerClass) as HookFunction[] || [])
   .map(hook => hook.bind(controller));
  const controllerPath = getMetadata('path', controllerClass) as string|undefined;

  for (const controllerClass of controller.subControllers || []) {
    for (const route of makeControllerRoutes2(controllerClass, services)) {
      yield {
        controller: route.controller,
        hooks: controllerHooks.concat(route.hooks),
        httpMethod: route.httpMethod,
        path: join(controllerPath, route.path),
        propertyKey: route.propertyKey,
      };
      // TODO: OpenAPI description of the route
    }
  }

  for (const propertyKey of getMethods(controllerClass.prototype)) {
    if (propertyKey === 'constructor') { continue; }

    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);
    if (httpMethod) {
      const methodPath = getMetadata('path', controllerClass, propertyKey) as string|undefined;
      const methodHooks = (getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [])
        .map(hook => hook.bind(controller));
      yield {
        controller,
        hooks: controllerHooks.concat(methodHooks),
        httpMethod,
        path: join(controllerPath, methodPath),
        propertyKey
      };
      // TODO: OpenAPI description of the route
    }
  }
}

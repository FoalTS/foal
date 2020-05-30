// FoalTS
import {
  getApiCompleteOperation,
  getApiComponents,
  getApiInfo,
  getApiTags,
  IApiComponents,
  IApiTag,
  IOpenAPI
} from '../../openapi';
import { mergeComponents, mergeTags } from '../../openapi/utils';
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

function* makeControllerRoutes(
  controllerClass: Class, services: ServiceManager
): Generator<{ route: Route, tags: IApiTag[]|undefined, components: IApiComponents }> {
  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);
  const openApi = services.get(OpenApi);

  // TODO: If openapi && Config.get('settings.openpi')

  // TODO: save the controllers
  // TODO: The service or this function should prefix the paths with a slash if there is not.
  // TODO: throw error if dupplicated paths
  // TODO: gather same methods under their shared path

  let document: IOpenAPI|undefined;

  const controllerHooks = (getMetadata('hooks', controllerClass) as HookFunction[] || [])
   .map(hook => hook.bind(controller));
  const controllerPath = getMetadata('path', controllerClass) as string|undefined;
  const controllerTags = getApiTags(controllerClass);
  const controllerComponents = getApiComponents(controllerClass, controller);

  const info = getApiInfo(controllerClass);
  if (info) {
    document = {
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

    if (Object.keys(controllerComponents).length > 0) {
      document.components = controllerComponents;
    }

    if (controllerTags) {
      document.tags = controllerTags;
    }
  }

  for (const controllerClass of controller.subControllers || []) {
    for (const { route, tags, components } of makeControllerRoutes(controllerClass, services)) {
      yield {
        components: mergeComponents(controllerComponents, components),
        route: {
          controller: route.controller,
          hooks: controllerHooks.concat(route.hooks),
          httpMethod: route.httpMethod,
          path: join(controllerPath, route.path),
          propertyKey: route.propertyKey,
        },
        tags: mergeTags(controllerTags, tags)
      };
      if (document) {
        document.tags = mergeTags(document.tags, tags);
        document.components = mergeComponents(document.components || {}, components);
      }
    }
  }

  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);

    if (!httpMethod) {
      continue;
    }

    const methodPath = getMetadata('path', controllerClass, propertyKey) as string|undefined || '';
    const methodHooks = (getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [])
      .map(hook => hook.bind(controller));
    const methodTags = getApiTags(controllerClass, propertyKey);
    const methodComponents = getApiComponents(controllerClass, controller, propertyKey);

    yield {
      components: mergeComponents(controllerComponents, methodComponents),
      route: {
        controller,
        hooks: controllerHooks.concat(methodHooks),
        httpMethod,
        path: join(controllerPath, methodPath),
        propertyKey
      },
      tags: mergeTags(controllerTags, methodTags)
    };

    if (document) {
      document.paths[methodPath] = {
        // TODO: use ...paths()
        // TODO: maybe use a merge
        [httpMethod.toLowerCase()]: getApiCompleteOperation(controllerClass, controller, propertyKey)
      };
      document.tags = Array.from(new Set(mergeTags(document.tags, methodTags)));
      document.components = mergeComponents(document.components || {}, methodComponents);
    }
  }

  if (document) {
    openApi.addDocument(controllerClass, document);
  }
}

export function* makeControllerRoutes2(controllerClass: Class, services: ServiceManager): Generator<Route> {
  for (const { route } of makeControllerRoutes(controllerClass, services)) {
    yield route;
  }
}

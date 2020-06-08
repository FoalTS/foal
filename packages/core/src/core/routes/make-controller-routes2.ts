// FoalTS
import {
  getApiCompleteOperation,
  getApiComponents,
  getApiInfo,
  getApiTags,
  IApiComponents,
  IApiOperation,
  IApiPaths,
  IApiTag,
  IOpenAPI
} from '../../openapi';
import { mergeComponents, mergeOperations, mergeTags } from '../../openapi/utils';
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

function normalizePath(path: string): string {
  return (path.startsWith('/') ? path : `/${path}`)
    .replace(/\:\w*/g, $1 => `{${$1.slice(1)}}`);
}

function throwErrorIfDuplicatePaths(paths: IApiPaths): void {
  const originalPaths: string[] = [];
  const convertedPaths: string[] = [];
  for (const path in paths) {
    const convertedPath = path.replace(/{.*}/g, () => '#');
    const index = convertedPaths.indexOf(convertedPath);
    if (index !== -1) {
      throw new Error(
        '[OpenAPI] Templated paths with the same hierarchy but different templated names'
        + ' MUST NOT exist as they are identical.'
        + `\n  Path 1: ${originalPaths[index]}`
        + `\n  Path 2: ${path}`
      );
    }
    originalPaths.push(path);
    convertedPaths.push(convertedPath);
  }
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

export function* makeControllerRoutes(controllerClass: Class, services: ServiceManager, openapi = false, documentControllers?: object[]): Generator<{
  route: Route, tags: IApiTag[]|undefined, components: IApiComponents, operation: IApiOperation
}> {
  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);

  const controllerHooks = (getMetadata('hooks', controllerClass) as HookFunction[] || [])
   .map(hook => hook.bind(controller));
  const controllerPath = getMetadata('path', controllerClass) as string|undefined;

  /* OpenAPI */
  const info = getApiInfo(controllerClass);
  // Check if the controller is inside an OpenAPI api. If not, components, operations and tags are discarded.
  openapi = !!info || openapi;

  // TODO: save the controllers
  const controllerTags = openapi ? getApiTags(controllerClass) : undefined;
  const controllerComponents = openapi ? getApiComponents(controllerClass, controller) : {};
  const controllerOperation = openapi ? getApiCompleteOperation(controllerClass, controller) : { responses: {} };
  if (openapi) {
    delete controllerOperation.servers;
    delete controllerOperation.externalDocs;
    delete controllerOperation.security;
  }

  /* OpenAPI */
  const openApi = services.get(OpenApi);
  let document: IOpenAPI|undefined;

  /* OpenAPI */
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

  documentControllers = document ? [] : documentControllers;
  if (documentControllers) {
    documentControllers.push(controller);
  }

  for (const controllerClass of controller.subControllers || []) {
    for (const { route, tags, components, operation } of makeControllerRoutes(controllerClass, services, openapi, documentControllers)) {
      yield {
        // OpenAPI
        components: openapi ? mergeComponents(controllerComponents, components) : {},
        // OpenAPI
        operation: openapi ? mergeOperations(controllerOperation, operation) : { responses: {} },
        route: {
          controller: route.controller,
          hooks: controllerHooks.concat(route.hooks),
          httpMethod: route.httpMethod,
          path: join(controllerPath, route.path),
          propertyKey: route.propertyKey,
        },
        // OpenAPI
        tags: openapi ? mergeTags(controllerTags, tags) : undefined
      };
      /* OpenAPI */
      if (document) {
        document.tags = mergeTags(document.tags, tags);
        document.components = mergeComponents(document.components || {}, components);
        const path = normalizePath(route.path);
        document.paths[path] = {
          ...document.paths[path], // Potentially undefined
          [route.httpMethod.toLowerCase()]: mergeOperations(controllerOperation, operation)
        };
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

    /* OpenAPI */
    const methodTags = openapi ? getApiTags(controllerClass, propertyKey) : undefined;
    const methodComponents = openapi ? getApiComponents(controllerClass, controller, propertyKey) : {};
    const methodOperation = openapi ?
      getApiCompleteOperation(controllerClass, controller, propertyKey) :
      { responses: {} };
    const operation = openapi ? mergeOperations(controllerOperation, methodOperation) : { responses: {} };

    yield {
      // OpenAPI
      components: openapi ? mergeComponents(controllerComponents, methodComponents) : {},
      // OpenAPI
      operation,
      route: {
        controller,
        hooks: controllerHooks.concat(methodHooks),
        httpMethod,
        path: join(controllerPath, methodPath),
        propertyKey
      },
      // OpenAPI
      tags: openapi ? mergeTags(controllerTags, methodTags) : undefined
    };

    /* OpenAPI */
    if (document) {
      const path = normalizePath(methodPath);
      document.paths[path] = {
        ...document.paths[path], // Potentially undefined
        [httpMethod.toLowerCase()]: operation
      };
      document.tags = Array.from(new Set(mergeTags(document.tags, methodTags)));
      document.components = mergeComponents(document.components || {}, methodComponents);
    }
  }

  /* OpenAPI */
  if (document) {
    throwErrorIfDuplicatePaths(document.paths);
    openApi.addDocument(controllerClass, document, documentControllers);
  }
}

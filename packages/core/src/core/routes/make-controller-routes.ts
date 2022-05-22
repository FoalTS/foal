// FoalTS
import { Class } from '../class.interface';
import { HookFunction } from '../hooks';
import {
  getApiCompleteOperation,
  getApiComponents,
  getApiInfo,
  getApiTags,
  IApiComponents,
  IApiOperation,
  IApiPaths,
  IApiTag,
  IOpenAPI,
  mergeComponents,
  mergeOperations,
  mergeTags,
  OpenApi
} from '../openapi';
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
    const convertedPath = path.replace(/{.*?}/g, () => '#');
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

function getPath(controllerClass: Class, propertyKey?: string): string {
  return getMetadata('path', controllerClass, propertyKey) as string|undefined || '';
}

function getHooks(controllerClass: Class, controller: object, propertyKey?: string): HookFunction[] {
  return (getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [])
    .map(hook => hook.bind(controller));
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
export function* makeControllerRoutes(
  controllerClass: Class, services: ServiceManager, openapi = false, documentControllers?: object[]
): Generator<{
  route: Route, components: IApiComponents, operation: IApiOperation,  tags?: IApiTag[]
}> {
  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);

  const controllerPath = getPath(controllerClass);
  const controllerHooks = getHooks(controllerClass, controller);

  /* OpenAPI */
  const info = getApiInfo(controllerClass);
  // Check if the controller is inside an OpenAPI api. If not, components, operations and tags are discarded.
  openapi = !!info || openapi;

  /* OpenAPI */
  const controllerComponents = openapi ? getApiComponents(controllerClass, controller) : {};
  const controllerOperation = openapi ? getApiCompleteOperation(controllerClass, controller) : { responses: {} };
  const controllerTags = openapi ? getApiTags(controllerClass) : undefined;
  if (openapi && info) {
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

    document.components = controllerComponents;
    document.tags = controllerTags;
  }

  documentControllers = document ? [] : documentControllers;
  if (documentControllers) {
    documentControllers.push(controller);
  }

  function processRoute(route: Route, components: IApiComponents, operation: IApiOperation, tags?: IApiTag[]) {
    /* OpenAPI */
    if (document) {
      const normalizedPath = normalizePath(route.path);
      document.paths[normalizedPath] = {
        ...document.paths[normalizedPath], // Potentially undefined
        [route.httpMethod.toLowerCase()]: mergeOperations(controllerOperation, operation)
      };
      document.tags = Array.from(new Set(mergeTags(document.tags, tags)));
      document.components = mergeComponents(document.components || {}, components);
    }

    return {
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
  }

  for (const controllerClass of controller.subControllers || []) {
    for (
      const { route, components, operation, tags } of
      makeControllerRoutes(controllerClass, services, openapi, documentControllers)
    ) {
      yield processRoute(route, components, operation, tags);
    }
  }

  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);

    if (!httpMethod) {
      continue;
    }

    const path = getPath(controllerClass, propertyKey);
    const hooks = getHooks(controllerClass, controller, propertyKey);
    const route = { controller, hooks, httpMethod, path, propertyKey };

    /* OpenAPI */
    const components = openapi ? getApiComponents(controllerClass, controller, propertyKey) : {};
    const operation = openapi ? getApiCompleteOperation(controllerClass, controller, propertyKey) : { responses: {} };
    const tags = openapi ? getApiTags(controllerClass, propertyKey) : undefined;

    yield processRoute(route, components, operation, tags);
  }

  /* OpenAPI */
  if (document) {
    if (document.components && Object.keys(document.components).length === 0) {
      delete document.components;
    }
    if (document.tags && Object.keys(document.tags).length === 0) {
      delete document.tags;
    }
    throwErrorIfDuplicatePaths(document.paths);
    openApi.addDocument(controllerClass, document, documentControllers);
  }
}
